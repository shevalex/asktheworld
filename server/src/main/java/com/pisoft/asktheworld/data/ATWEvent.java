package com.pisoft.asktheworld.data;

import com.fasterxml.jackson.annotation.JsonValue;
import com.pisoft.asktheworld.data.ATWEvent.Type;

public class ATWEvent {
	public enum Type {
   	 OUTGOING_REQUESTS_CHANGED("OUTGOING_REQUESTS_CHANGED"),
   	 INCOMING_REQUESTS_CHANGED("INCOMING_REQUESTS_CHANGED"),
   	 REQUEST_CHANGED("REQUEST_CHANGED"),
   	 OUTGOING_RESPONSES_CHANGED("OUTGOING_RESPONSES_CHANGED"),
   	 INCOMING_RESPONSES_CHANGED("INCOMING_RESPONSES_CHANGED"),
   	 RESPONSE_CHANGED("RESPONSE_CHANGED");
   	 
   	 private final String value;
   	 private Type(String value) {
   		 this.value = value;
   	 }
		
		public String toString() {
			// TODO Auto-generated method stub
			return value;
		}    	 
    }
	
	private Type type;
	private int request_id;
	private int requests_ids[];
	private int response_id;
	private int response_idsp[];
	
	private ATWEvent(Type type) {
		this.type = type;
	}
	
	static public ATWEvent getOutReqChanged() {
		return new ATWEvent(Type.OUTGOING_REQUESTS_CHANGED);
	}
	
	static public ATWEvent getIncReqChanged() {
		return new ATWEvent(Type.INCOMING_REQUESTS_CHANGED);
	}
	
	static public ATWEvent getReqChanged(int reqId) {
		ATWEvent event = new ATWEvent(Type.REQUEST_CHANGED);
		event.request_id = reqId;
		return event;
	}
	
	static public ATWEvent getOutRespChanged(int reqId) {
		ATWEvent event = new ATWEvent(Type.OUTGOING_RESPONSES_CHANGED);
		event.request_id = reqId;
		return event;
	}
	
	static public ATWEvent getIncRespChanged(int reqId) {
		ATWEvent event = new ATWEvent(Type.INCOMING_RESPONSES_CHANGED);
		event.request_id = reqId;
		return event;
	}
	
	static public ATWEvent getRespChanged(int reqId, int respId) {
		ATWEvent event = new ATWEvent(Type.RESPONSE_CHANGED);
		event.request_id = reqId;
		event.response_id = respId;
		return event;
	}
	
	
	
	@JsonValue
	public String toValue() {
		StringBuffer sb = new StringBuffer("{\"type\":\"").append(type.value).append("\"");
		if(type == Type.OUTGOING_REQUESTS_CHANGED) {
			sb.append(",\"request_ids\":null");
		} else if (type == Type.INCOMING_REQUESTS_CHANGED) {
			sb.append(",\"request_ids\":null");
		} else if (type == Type.REQUEST_CHANGED) {
			sb.append(",\"request_id\":").append(request_id);
		} else if (type == Type.OUTGOING_RESPONSES_CHANGED) {
		    sb.append(",\"request_id\":").append(request_id);
		    sb.append(",\"response_ids\":null");
		} else if (type == Type.INCOMING_RESPONSES_CHANGED) {
			sb.append(",\"request_id\":").append(request_id);
			sb.append(",\"response_ids\":null");
		} else if (type == Type.RESPONSE_CHANGED) {
			sb.append(",\"request_id\":").append(request_id);
			sb.append(",\"response_id\":").append(response_id);
		}
		sb.append("}");
		return sb.toString();
	}
}
