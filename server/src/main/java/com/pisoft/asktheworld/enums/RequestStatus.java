package com.pisoft.asktheworld.enums;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RequestStatus {
	ACTIVE("active"),
	INACTIVE("inactive"),
	ALL("all");

	private final String status;
	
	private RequestStatus(String s) {
		status = s;
	}
	
	public boolean equals(String s) {
		return s == this.status;
	}
	
	private static Map<String, RequestStatus> map = new HashMap<String, RequestStatus>();

	static {
		   for(RequestStatus s : EnumSet.allOf(RequestStatus.class))
               map.put(s.status, s);
	}

	@JsonCreator
	public static RequestStatus forValue(String value) {
	    RequestStatus rs = map.get(value.toLowerCase()); 
		return rs!=null?rs:ALL;
	}

	@JsonValue
	public String toValue() {
		return status;
	}
}
