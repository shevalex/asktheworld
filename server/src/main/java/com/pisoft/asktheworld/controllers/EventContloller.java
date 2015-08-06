package com.pisoft.asktheworld.controllers;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pisoft.asktheworld.data.ATWEvent;
import com.pisoft.asktheworld.data.ATWRequest;
import com.pisoft.asktheworld.data.DB;


//~/events/user/{user id}
@RestController
public class EventContloller {

	@Autowired
	private DB db;
	
	@RequestMapping(method=RequestMethod.GET, value="/events/user/{user_id}")
	public ResponseEntity<Map<String, Object>> getEvents(@PathVariable("user_id") int user_id,  @RequestParam(value="timestamp", required = false, defaultValue="0") long  timeStamp) {
		//TODO:"Need to add security check. Should we add it in security filter or here?"
		//System.out.println("Request id " + id);
		long requestTime = new Date().getTime();
		List<ATWEvent> list = db.getUpdates(user_id, timeStamp, requestTime);
		if( list == null) {
			return new ResponseEntity<Map<String, Object>>(HttpStatus.NOT_FOUND);
		}
	    
		Map<String, Object> map = new HashMap<String, Object>(2); 
		map.put("timestamp", Long.valueOf(requestTime));
		map.put("events", list);
		return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
	}
}
