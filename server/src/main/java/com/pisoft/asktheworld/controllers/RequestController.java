package com.pisoft.asktheworld.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

@RestController
public class RequestController {
	@Autowired
	private DB db;
	
	@RequestMapping(method = RequestMethod.POST, value="request")
	public ResponseEntity<String> createUser(@RequestBody ATWRequest request) {
		//check if user exist (by name)
		//TODO: rework this fucking logic
		ATWUser existUser = db.getUser(request.getUser_id());
		if (existUser != null) {
			db.addRequest(request);
			HttpHeaders headers = new HttpHeaders();
			try {
				headers.setLocation(new URI(""+request.getId()));
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ResponseEntity<String>(""+request.getId(), headers, HttpStatus.CONFLICT);
		} else {
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value="/request/{requestID}")
	public ResponseEntity<Void> deleteUser(@PathVariable("requestID") int id) {
		ATWRequest request = db.deleteRequest(id);
		return new ResponseEntity<Void>( request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	
	@RequestMapping(method=RequestMethod.GET, value="/request/{requestID}")
	public ResponseEntity<ATWRequest> getUser(@PathVariable("requestID") int id) {
		ATWRequest request  = db.getRequest(id);
/*		if(request != null) {
			req  = user.createCopy();
		}
*/
		return new ResponseEntity<ATWRequest>(request, request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	
	@RequestMapping(method=RequestMethod.PUT, value="/request/{requestID}")
	public ResponseEntity<Void> updateUser(@PathVariable("requestID") int id, @RequestBody ATWRequest request) {
		request.setId(id);
		request= db.updateRequest(request);
		return new ResponseEntity<Void>( request != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@RequestMapping(method=RequestMethod.GET, value="request")
	public ResponseEntity<String> getUsers(@RequestParam(value="user_id", required = true) int id) {
		List<Integer> list = db.getUserRequestsIDs(id);
		if(list == null) {
			return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<String>("{\"responses\":"+Arrays.toString(list.toArray())+"}", HttpStatus.OK);
	}

	
	
	
	

}
