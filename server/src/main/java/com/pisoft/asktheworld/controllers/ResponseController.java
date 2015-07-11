package com.pisoft.asktheworld.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.ATWRequest;
import com.pisoft.asktheworld.data.ATWResponse;
import com.pisoft.asktheworld.data.ATWUser;
import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.enums.ResponseStatus;

@RestController
public class ResponseController {
	@Autowired
	private DB db;

	@RequestMapping(method = RequestMethod.POST, value="response")
	public ResponseEntity<String> createRequest(@RequestBody ATWResponse response) {
		ATWUser existUser = db.getUser(response.getUser_id());
		ATWRequest existRequest = db.getRequest(response.getRequestId());
		
		if (existUser != null && existRequest != null) {
			db.addResponse(response);
			HttpHeaders headers = new HttpHeaders();
			try {
				headers.setLocation(new URI(""+response.getId()));
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ResponseEntity<String>(""+response.getId(), headers, HttpStatus.CREATED);
		} else { //if user or request is not exist
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/response/{responseID}")
	public ResponseEntity<Void> updateUser(@PathVariable("responseID") int id, @RequestBody ATWResponse response) {
		response.setId(id);
		response = db.updateResponse(response);
		//TODO: need check for values (400 error)
		//TODO: Need to check for owner (403 error). Chould we check here or in filter? 
		return new ResponseEntity<Void>( response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(method=RequestMethod.DELETE, value="/response/{responseID}")
	public ResponseEntity<Void> deleteUser(@PathVariable("responseID") int id, @RequestBody ATWResponse response) {
		response = db.deleteResponse(id);
		//TODO: need check for values (400 error)
		//TODO: Need to check for owner (403 error). Chould we check here or in filter? 
		return new ResponseEntity<Void>( response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@RequestMapping(method=RequestMethod.GET, value="/response/{responseID}")
	public ResponseEntity<ATWResponse> getUser(@PathVariable("responseID") int id) {
		//System.out.println("Request id " + id);
		ATWResponse response  = db.getResponse(id);
		//TODO:"Need to add security check. Should we add it in security filter or here?"
		//We can compare request owner id with current user ID
		//Plus we need to check if this user has this request in incoming list??
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

	@RequestMapping(method=RequestMethod.GET, value="/user/{user_id}/responses/incomming/{requestID}")
	public ResponseEntity<Map<String, List<Integer>>> getIncommingResponses(@PathVariable("user_id") int user_id, @PathVariable("requestID") int requestID,
			@RequestParam(value="status", required = false, defaultValue="all") String  status,
			@RequestParam(value="sorting", required = false, defaultValue="chronologically") String  sorting) {
		//TODO: check if user id is correct?  I am not sure that we need to check this
		List<Integer> viewedList = new ArrayList<Integer>();
		List<Integer> unviewedList = new ArrayList<Integer>();
		ResponseStatus rs = ResponseStatus.forValue(status);
		if (db.getIncommingResponseIDs(user_id, requestID, rs, sorting, viewedList, unviewedList) == null) {
			return new ResponseEntity<Map<String, List<Integer>>>(HttpStatus.NOT_FOUND);
		}
		Map<String, List<Integer>> map = new HashMap<String, List<Integer>>(2);
		map.put("viewed", viewedList);
		map.put("unviewed", unviewedList);
		
		return new ResponseEntity<Map<String, List<Integer>>>(map, HttpStatus.OK);
	}

	
	@RequestMapping(method=RequestMethod.DELETE, value="/responseuser/{user_id}/responses/incomming/{responseID}")
	public ResponseEntity<Void> deleteIncommingResponses(@PathVariable("user_id") int user_id, @PathVariable("responseID") int responseID) {
		//TODO: add security
		//TODO: check if user id is correct?  I am not sure that we need to check this
		ATWResponse response = db.deleteIncommingResponse(user_id, responseID);
		return new ResponseEntity<Void>( response != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

}
