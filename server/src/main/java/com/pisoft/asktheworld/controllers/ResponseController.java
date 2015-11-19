package com.pisoft.asktheworld.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.ATWRequest;
import com.pisoft.asktheworld.data.ATWResponse;
import com.pisoft.asktheworld.data.ATWSettings;
import com.pisoft.asktheworld.data.ATWUser;
import com.pisoft.asktheworld.data.ATWUserSettings;
import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.enums.ContactInfoStatus;
import com.pisoft.asktheworld.enums.ResponseStatus;

@RestController
public class ResponseController {
	@Autowired
	private DB db;

	@RequestMapping(method = RequestMethod.POST, value="response")
	public ResponseEntity<ATWResponse> createResponse(@RequestBody ATWResponse response) {
		//TODO: replace with db.existRequest Now, we dont check is this request is incoming for particular user
		ATWUser existUser = db.getUser(response.getUser_id());
		ATWRequest existRequest = db.getRequest(response.getRequest_id());
		if (existUser != null && existRequest != null) {
			response = db.addResponse(response);
			HttpHeaders headers = new HttpHeaders();
			try {
				headers.setLocation(new URI(""+response.getId()));
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			response.provideAllFileds();
			return new ResponseEntity<ATWResponse>(response, headers, HttpStatus.CREATED);
		} else { //if user or request is not exist
			return new ResponseEntity<ATWResponse>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/response/{responseID}")
	public ResponseEntity<ATWResponse> updateUser(@PathVariable("responseID") int id, @RequestBody ATWResponse response) {
		response.setId(id);
		response = db.updateResponse(response);
		//TODO: need check for values (400 error)
		//TODO: Need to check for owner (403 error). Chould we check here or in filter? 
		return new ResponseEntity<ATWResponse>( response, response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(method=RequestMethod.DELETE, value="/response/{responseID}")
	public ResponseEntity<Void> deleteUser(@PathVariable("responseID") int id, @RequestBody ATWResponse response) {
		response = db.deleteResponse(id);
		//TODO: need check for values (400 error)
		//TODO: Need to check for owner (403 error). Chould we check here or in filter? 
		return new ResponseEntity<Void>( response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@RequestMapping(method=RequestMethod.GET, value="/response/{responseID}")
	public ResponseEntity<ATWResponse> getResponse(@PathVariable("responseID") int id, 
			@RequestParam(value="paid", required = false) String  paid, Principal principal) {
		//System.out.println("Request id " + id);
		ATWResponse response  = db.getResponse(id);
		if (response != null) {
			if (principal != null && principal instanceof UsernamePasswordAuthenticationToken ) {
				ATWUser requestor = (ATWUser) ((UsernamePasswordAuthenticationToken)principal).getCredentials();
				if(response.getUser_id() == requestor.getUser_id()) {
					System.out.println("Owner request");
					response.provideAllFileds();
				}
				
			} else {
				System.out.println("Principal is null");
			}
			//TODO:"Need to add security check. Should we add it in security filter or here?"
			//We can compare request owner id with current user ID
			//Plus we need to check if this user has request in incoming list??
		
			//Some additional information is requested
			if ( paid != null ) {
				response.setPaidStatus(paid);
				db.saveResponse(response);
			}
		}
		return new ResponseEntity<ATWResponse>(response, response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/user/{user_id}/responses/outgoing/{requestID}")
	public ResponseEntity<Map<String, List<Integer>>> getOutgoingResponses(@PathVariable("user_id") int user_id, @PathVariable("requestID") int requestID,
			@RequestParam(value="status", required = false, defaultValue="all") String  status,
			@RequestParam(value="sorting", required = false, defaultValue="chronologically") String  sorting) {
		//TODO: check if user id is correct?  I am not sure that we need to check this
		List<Integer> viewedList = new ArrayList<Integer>();
		List<Integer> unviewedList = new ArrayList<Integer>();
		ResponseStatus rs = ResponseStatus.forValue(status);
		if (db.getOutgongResponseIDs(user_id, requestID, rs, sorting, viewedList, unviewedList) == null) {
			return new ResponseEntity<Map<String, List<Integer>>>(HttpStatus.NOT_FOUND);
		}
		Map<String, List<Integer>> map = new HashMap<String, List<Integer>>(2);
		map.put("viewed", viewedList);
		map.put("unviewed", unviewedList);
		
		return new ResponseEntity<Map<String, List<Integer>>>(map, HttpStatus.OK);
	}

	@RequestMapping(method=RequestMethod.GET, value="/user/{user_id}/responses/incoming/{requestID}")
	public ResponseEntity<Map<String, List<Integer>>> getIncomingResponses(@PathVariable("user_id") int user_id, @PathVariable("requestID") int requestID,
			@RequestParam(value="status", required = false, defaultValue="all") String  status,
			@RequestParam(value="sorting", required = false, defaultValue="chronologically") String  sorting) {
		//TODO: check if user id is correct?  I am not sure that we need to check this
		List<Integer> viewedList = null;
		List<Integer> unviewedList = null;
		ResponseStatus rs = ResponseStatus.forValue(status);
		switch(rs){
		case UNVIEWED:
			unviewedList = new ArrayList<Integer>();
			break;
		case VIEWED:
			viewedList = new ArrayList<Integer>();
			break;
		case ALL:
		default:
			unviewedList = new ArrayList<Integer>();
			viewedList = new ArrayList<Integer>();
			break;
		}
		if (db.getIncomingResponseIDs(user_id, requestID, rs, sorting, viewedList, unviewedList) == null) {
			return new ResponseEntity<Map<String, List<Integer>>>(HttpStatus.NOT_FOUND);
		}
		Map<String, List<Integer>> map = new HashMap<String, List<Integer>>(2);
		map.put("viewed", viewedList);
		map.put("unviewed", unviewedList);
		
		return new ResponseEntity<Map<String, List<Integer>>>(map, HttpStatus.OK);
	}

	
	@RequestMapping(method=RequestMethod.DELETE, value="/user/{user_id}/responses/incoming/{responseID}")
	public ResponseEntity<Void> deleteIncomingResponses(@PathVariable("user_id") int user_id, @PathVariable("responseID") int responseID) {
		//TODO: add security
		//TODO: check if user id is correct?  I am not sure that we need to check this
		ATWResponse response = db.deleteIncomingResponse(user_id, responseID);
		return new ResponseEntity<Void>( response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
/*
	//TEST API, delete in release
	//TODO: is there any way to control availability API through release/debug configuration 
	@RequestMapping(method=RequestMethod.GET, value="/responses/all")
	public ResponseEntity<List<ATWResponse>> getAllResponses() {
		List<ATWResponse> responses = db.getResponses();
		return new ResponseEntity<List<ATWResponse>>( responses,HttpStatus.OK);
	}

	@RequestMapping(method=RequestMethod.GET, value="/responses/{user_id}")
	public ResponseEntity<List<ATWResponse>> getAllResponses(@PathVariable("user_id") int user_id) {
		List<ATWResponse> responses = db.getResponses(user_id);
		return new ResponseEntity<List<ATWResponse>>( responses,HttpStatus.OK);
	}
/**/

}
