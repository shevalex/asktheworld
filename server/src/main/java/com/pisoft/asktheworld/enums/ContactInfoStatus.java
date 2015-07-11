package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ContactInfoStatus {
	NO("no"),
	PROVIDE("can_provide"),
	PROVIDED("provided");
	
	private static Map<String, ContactInfoStatus> map = new HashMap<String, ContactInfoStatus>(2);
	private final String value;

	static {
		   for(ContactInfoStatus s : EnumSet.allOf(ContactInfoStatus.class))
            map.put(s.value, s);
	}

	@JsonCreator
	public static ContactInfoStatus forValueJson(String value) {
	    ContactInfoStatus g = forValue(value);
		return g!=null?g:NO;  
	}

	@JsonValue
	public String toValueJason() {
		return value;
	}

	public static ContactInfoStatus forValue(String value) {
	    return map.get(value.toLowerCase()); //TODO: is toLowCase quick enought? 
	}

    private ContactInfoStatus(String gender) {
        this.value = gender;
    }
}
