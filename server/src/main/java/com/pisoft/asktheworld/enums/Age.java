package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Age {
    TEENS("teens"),
    ADULTS("adults"),
    SENIORS("senior");
    
    
	private Age(String value) {
		this.value = value;
	}

	private static Map<String, Age> map = new HashMap<String, Age>();
	private final String value;
	static {
		   for(Age s : EnumSet.allOf(Age.class))
            map.put(s.value, s);
	}

	@JsonCreator
	public static Age forValue(String value) {
	    return map.get(value);
	}

	@JsonValue
	public String toValue() {
		return value;
	}

}