package com.pisoft.asktheworld.controllers;


import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;

import org.jboss.logging.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.data.ATWUser;


@RestController
public class UserController {
	@Autowired
	private DB db;

	@RequestMapping(method = RequestMethod.POST, value="user")
	public ResponseEntity<ATWUser> createUser(@RequestBody ATWUser user) {
		//check name, pass, year
		if(!db.verifyString(user.getLogin()) || !db.verifyString(user.getPassword())) {
			//error wrong arguments
			return new ResponseEntity<ATWUser>(HttpStatus.BAD_REQUEST);
		}
		//check if user exist (by name)
		//TODO: rework this fucking logic
		ATWUser existUser = db.findUser(user.getLogin());
		ATWUser newUser = null;
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
			return new ResponseEntity<ATWUser>(existUser, headers, newUser != null ? HttpStatus.CREATED : HttpStatus.CONFLICT);
		} else {
			return new ResponseEntity<ATWUser>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.DELETE, value="/user/{userID}")
	public ResponseEntity<Void> deleteUser(@PathVariable("userID") int id) {
		ATWUser user = db.deleteUser(id);
		return new ResponseEntity<Void>( user != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method=RequestMethod.GET, value="/user/{userID}")
	public ResponseEntity<ATWUser> getUser(@PathVariable("userID") int id) {
		ATWUser user  = db.getUser(id);
		if(user != null) {
			user  = user.createCopy();
		}
		return new ResponseEntity<ATWUser>(user, user != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method=RequestMethod.PUT, value="/user/{userID}")
	public ResponseEntity<ATWUser> updateUser(@PathVariable("userID") int id, @RequestBody ATWUser user) {
		user.setId(id);
		user = db.updateUser(user);
		return new ResponseEntity<ATWUser>( user, user != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

	@Secured({"ROLE_ADMIN", "ROLE_USER"})
	@RequestMapping(method=RequestMethod.GET, value="user")
	public ResponseEntity<String> getUsers(@RequestParam(value="login", required = false) String login) {
		if(login != null) {
			ATWUser user = db.findUser(login);
			if (user == null) {
				return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<String>("{\"user_id\":"+user.getId()+"}", HttpStatus.OK);
			}
		}
		return new ResponseEntity<String>("{\"users\":"+Arrays.toString(db.getIDs())+"}", HttpStatus.OK);
	}
	
	@RequestMapping(method=RequestMethod.GET, value="userdump")
	public ResponseEntity<ATWUser[]> getUsersDump() {
		return new ResponseEntity<ATWUser[]>(db.getUsers(), HttpStatus.OK);
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="userdump")
	public ResponseEntity<Void> getUsersDump1() {
		return new ResponseEntity<Void>(HttpStatus.OK);
	}
	
//User's settings
	

	
}
