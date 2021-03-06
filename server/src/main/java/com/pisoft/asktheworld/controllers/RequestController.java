package com.pisoft.asktheworld.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.inject.Produces;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.ATWRequest;
import com.pisoft.asktheworld.data.ATWUser;
import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.enums.RequestStatus;

@RestController
public class RequestController {
	@Autowired
	private DB db;
	
	@RequestMapping(method = RequestMethod.POST, value="request")
	public ResponseEntity<ATWRequest> createRequest(@RequestBody ATWRequest request) {
		//check if user exist (by name)
		//TODO: rework this fucking logic
		ATWUser existUser = db.getUser(request.getUser_id());
		if (existUser != null) {
			request = db.addRequest(request);
			HttpHeaders headers = new HttpHeaders();
			try {
				headers.setLocation(new URI(""+request.getId()));
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ResponseEntity<ATWRequest>(request, headers, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<ATWRequest>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/request/{requestID}")
	public ResponseEntity<Void> deleteRequest(@PathVariable("requestID") int id) {
		ATWRequest request = db.deleteRequest(id);
		//TODO: Need check for owner (403 error)
		return new ResponseEntity<Void>( request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	
	@RequestMapping(method=RequestMethod.GET, value="/request/{requestID}")
	public ResponseEntity<ATWRequest> getRequest(@PathVariable("requestID") int id) {
		//System.out.println("Request id " + id);
		ATWRequest request  = db.getRequest(id);
		//TODO:"Need to add security check. Should we add it in security filter or here?"
		//We can compare request owner id with current user ID
		//Plus we need to check if this user has this request in incoming list??
		return new ResponseEntity<ATWRequest>(request, request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	
	@RequestMapping(method=RequestMethod.PUT, value="/request/{requestID}")
	public ResponseEntity<ATWRequest> updateRequest(@PathVariable("requestID") int id, @RequestBody ATWRequest request) {
		request.setId(id);
		request = db.updateRequest(request);
		//TODO: need check for values (400 error)
		//TODO: Need to check for owner (403 error). Chould we check here or in filter? 
		return new ResponseEntity<ATWRequest>( request, request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
		
	}

	//For specific user outgoing requests
	@RequestMapping(method=RequestMethod.GET, value="/user/{user_id}/requests/outgoing")
	public ResponseEntity<Map<String, List<Integer>>> getOutgoingRequests(@PathVariable("user_id") int id, @RequestParam(value="status", required = false, defaultValue="all") String  status,
			@RequestParam(value="sorting", required = false, defaultValue="chronologically") String  sorting) {
		//TODO: check if user id is correct?  I am not sure that we should check this
		List<Integer> activeList = new ArrayList<Integer>();
		List<Integer> inactiveList = new ArrayList<Integer>();

		if(db.getUserOutgoingRequestsIDs(id, status, sorting, activeList, inactiveList) == null) {
			return new ResponseEntity<Map<String, List<Integer>>>(HttpStatus.NOT_FOUND);
		}
		//TODO: Map is not good here. Overhead. We need simple pair
		Map<String, List<Integer>> map = new HashMap<String, List<Integer>>(2);
		map.put("active", activeList);
		map.put("inactive", inactiveList);
		
		return new ResponseEntity<Map<String, List<Integer>>>(map, HttpStatus.OK);
	}
	
	//For specific user incoming requests 
	@RequestMapping(method=RequestMethod.GET, value="/user/{user_id}/requests/incoming")
	public ResponseEntity<Map<String, List<Integer>>> getIncomingRequests(@PathVariable("user_id") int id, @RequestParam(value="status", required = false, defaultValue="all") String  status,
			@RequestParam(value="sorting", required = false, defaultValue="chronologically") String  sorting) {
		//TODO: check if user id is correct?  I am not sure that we need to check this
		List<Integer> activeList = new ArrayList<Integer>();
		List<Integer> inactiveList = new ArrayList<Integer>();
		if (db.getUserIncomingRequestsIDs(id, status, sorting, activeList, inactiveList) == null) {
			return new ResponseEntity<Map<String, List<Integer>>>(HttpStatus.NOT_FOUND);
		}
		Map<String, List<Integer>> map = new HashMap<String, List<Integer>>(2);
		map.put("active", activeList);
		map.put("inactive", inactiveList);
		
		return new ResponseEntity<Map<String, List<Integer>>>(map, HttpStatus.OK);
	}

	@RequestMapping(method=RequestMethod.DELETE, value="/user/{user_id}/requests/incoming/{requestID}")
	public ResponseEntity<Void> deleteIncomingRequests(@PathVariable("user_id") int userId, @PathVariable("requestID") int requestId) {
		//TODO: check if user id is correct?  I am not sure that we need to check this
		ATWRequest request = db.deleteUserIncomingRequests(userId, requestId);
        return new ResponseEntity<Void>( request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	


//~/user/{user id}/requests/incoming
//status=<request status to match against the returned request ids>. If not specified, all requests will be returned.
//sorting=”chronologically” | … TBD
	
}
