package com.pisoft.asktheworld.controllers;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;

import org.jboss.logging.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.data.User;


@RestController
public class UserController {
	private DB db = DB.getInstance();
	@RequestMapping(method = RequestMethod.POST, value="user")
	public ResponseEntity<String> createUser(@RequestBody User user) {
		//check name, pass, year
		if(!db.verifyString(user.getLogin()) || !db.verifyString(user.getPassword())) {
			//error wrong arguments
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
		//check if user exist (by name)
		//TODO: rework this fucing logic
		User existUser = db.findUser(user.getLogin());
		User newUser = null;
		if (existUser == null) {
			newUser = db.addUser(user);
			existUser = newUser; 
		}
		if (existUser != null) {
			HttpHeaders headers = new HttpHeaders();
			try {
				headers.setLocation(new URI(""+existUser.getId()));
			} catch (URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ResponseEntity<String>(""+existUser.getId(), headers, newUser != null ? HttpStatus.CREATED : HttpStatus.CONFLICT);
		} else {
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.DELETE, value="user/{userID}")
	public ResponseEntity<Void> deleteUser(@PathVariable("userID") int id) {
		User user = db.deleteUser(id);
		return new ResponseEntity<Void>( user != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method=RequestMethod.GET, value="/user/{userID}")
	public ResponseEntity<User> getUser(@PathVariable("userID") int id) {
		User user  = db.getUser(id);
		if(user != null) {
			user  = user.createCopy();
		}
		return new ResponseEntity<User>(user, user != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="user/{userID}")
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	public ResponseEntity<Void> updateUser(@PathVariable("userID") int id, @RequestBody User user) {
		user.setId(id);
		user = db.updateUser(user);
		return new ResponseEntity<Void>( user != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@Secured({"ROLE_ADMIN", "ROLE_USER"})
	@RequestMapping(method=RequestMethod.GET, value="user")
	public ResponseEntity<String> getUsers(@RequestParam(value="login", required = false) String login) {
		if(login != null) {
			User user = db.findUser(login);
			if (user == null) {
				return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<String>("{\"userId\":"+user.getId()+"}", HttpStatus.OK);
			}
		}
		return new ResponseEntity<String>("{\"users\":"+Arrays.toString(db.getIDs())+"}", HttpStatus.OK);
	}

	
}
