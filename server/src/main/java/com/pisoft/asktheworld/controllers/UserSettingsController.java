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

import com.pisoft.asktheworld.data.ATWSettings;
import com.pisoft.asktheworld.data.ATWUserSettings;
import com.pisoft.asktheworld.data.DB;

@RestController
public class UserSettingsController {
	@Autowired
	private DB db;

	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.PUT, value="/user/{userID}/preferences")
	public ResponseEntity<ATWUserSettings> updateUserPreferences(@PathVariable("userID") int id, @RequestBody ATWUserSettings preferences) {
		preferences.setId(id);
		preferences = db.updateUserPreferences(preferences);
		return new ResponseEntity<ATWUserSettings>(preferences, preferences != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.GET, value="/user/{userID}/preferences")
	public ResponseEntity<ATWUserSettings> getUserPreferences(@PathVariable("userID") int id) {
		ATWUserSettings preferences = db.getUserPreferences(id);
		return new ResponseEntity<ATWUserSettings>(preferences, preferences != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
	@Secured({"ROLE_ADMIN","ROLE_REAL_USER"})
	@RequestMapping(method = RequestMethod.GET, value="user/{userID}/settings")
	public ResponseEntity<ATWSettings> getUserSettings(@PathVariable("userID") int id) {
		ATWSettings settings = db.getUserSettings(id);
		return new ResponseEntity<ATWSettings>(settings, settings != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	}
	
}
