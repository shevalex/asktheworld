package com.pisoft.asktheworld.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.ATWUserSettings;
import com.pisoft.asktheworld.data.DB;

@RestController
public class UserSettingsController {
	@Autowired
	private DB db;

	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.PUT, value="/user/{userID}/settings")
	public ResponseEntity<Void> updateUserSettings(@PathVariable("userID") int id, @RequestBody ATWUserSettings settings) {
		settings.setId(id);
		settings = db.updateUserSettings(settings);
		return new ResponseEntity<Void>(settings != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.GET, value="/user/{userID}/settings")
	public ResponseEntity<ATWUserSettings> updateUserSettings(@PathVariable("userID") int id) {
		ATWUserSettings settings = db.getUserSettings(id);
		return new ResponseEntity<ATWUserSettings>(settings, settings != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}

}
