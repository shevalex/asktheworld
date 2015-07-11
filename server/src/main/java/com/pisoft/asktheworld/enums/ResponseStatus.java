package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ResponseStatus {
    VIEWED("viewed"),
    UNVIEWED("unviewed"),
    ALL("all");

    private ResponseStatus(String status) {
        this.value = status;
    }

    private static Map<String, ResponseStatus> map = new HashMap<String, ResponseStatus>();
	private final String value;
	static {
		   for(ResponseStatus s : EnumSet.allOf(ResponseStatus.class))
            map.put(s.value, s);
	}

	@JsonCreator
	public static ResponseStatus forValue(String value) {
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