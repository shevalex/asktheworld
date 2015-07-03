package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AgeRequest {
    CHILDREN("children"),
	TEENAGER("teenager"),
	YOUNG("young"),
	ADULTS("adults"),
    SENIORS("senior"),
    ALL("all");
    
    
	private AgeRequest(String value) {
		this.value = value;
	}

	private static Map<String, AgeRequest> map = new HashMap<String, AgeRequest>();
	private final String value;
	static {
		   for(AgeRequest s : EnumSet.allOf(AgeRequest.class))
            map.put(s.value, s);
	}

	@JsonCreator
	public static AgeRequest forValue(String value) {
	    return map.get(value);
	}

	@JsonValue
	public String toValue() {
		return value;
	}
	public String toQueryString() {
		if (this == ALL) {
			return "%";
		}
		return toValue();
	}
}
