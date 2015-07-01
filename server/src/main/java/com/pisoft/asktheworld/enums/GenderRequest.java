package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum GenderRequest {
    MALE("male"),
    FAMALE("famale"),
    OTHER("other"), //TODO: do we need this here? 
    ALL("all");

	private static Map<String, GenderRequest> map = new HashMap<String, GenderRequest>();
	private final String value;
	static {
		   for(GenderRequest s : EnumSet.allOf(GenderRequest.class))
            map.put(s.value, s);
	}

	@JsonCreator
	public static GenderRequest forValue(String value) {
	    return map.get(value.toLowerCase());
	}

	@JsonValue
	public String toValue() {
		return value;
	}
    
    private GenderRequest(String gender) {
        this.value = gender;
    }

}
