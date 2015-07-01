package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("male"),
    FAMALE("famale"),
    OTHER("other");
    

	private static Map<String, Gender> map = new HashMap<String, Gender>();
	private final String value;
	static {
		   for(Gender s : EnumSet.allOf(Gender.class))
            map.put(s.value, s);
	}

	@JsonCreator
	public static Gender forValue(String value) {
	    return map.get(value);
	}

	@JsonValue
	public String toValue() {
		return value;
	}
    
    private Gender(String gender) {
        this.value = gender;
    }

}
