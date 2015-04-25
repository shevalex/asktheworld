package com.pisoft.asktheworld.enums;

import org.hibernate.internal.util.compare.EqualsHelper;

public enum RequestStatus {
	ACTIVE("active"),
	EXPIRED("expired"),
	DELETED("deleted"),
	ALL("all");
	
	private RequestStatus(String s) {
		status = s;
	}
	
	
	public boolean equals(String s) {
		return s == this.status;
	}
	
	private final String status;
}
