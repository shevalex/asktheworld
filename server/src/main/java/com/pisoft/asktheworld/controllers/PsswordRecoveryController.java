package com.pisoft.asktheworld.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pisoft.asktheworld.data.ATWToken;
import com.pisoft.asktheworld.data.ATWUser;
import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.service.MailSender;

@RestController
public class PsswordRecoveryController {

	@Autowired
	private DB db;
	
	@Autowired
	private MailSender ms;
	
	@RequestMapping(method = RequestMethod.GET, value="reset")
	public ResponseEntity<Void> requestRecovery(HttpServletRequest request, @RequestParam(value="login", required = true) String login) {
		ATWToken token = db.requestRecoveryPasswod(login);
		if (token != null) {
			ms.sendRecoveryPassword(token.getEmail(), 
					"https://" + request.getServerName() + ":" + request.getServerPort(), token.getToken());
			return new ResponseEntity<Void>( HttpStatus.OK );
		}
		return new ResponseEntity<Void>( HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="reset")
	public ResponseEntity<Void> requestRecovery(@RequestBody String body,
			@RequestParam(value="login", required = true) String login, 
			@RequestParam(value="token", required = true) String token) {
		ObjectMapper om = new ObjectMapper();
		Map<String, String> map;
		try {
			map = om.readValue(body, HashMap.class);
			String password = map.get("password");
			ATWUser user = db.findUser(login);
			if ( user == null) return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
			return new ResponseEntity<Void>( db.resetPassword(user, token, password) ? HttpStatus.OK : HttpStatus.FORBIDDEN);
		} catch (Exception e) {
		}
		return new ResponseEntity<Void>( HttpStatus.FORBIDDEN);
		
	}
	
			
}
