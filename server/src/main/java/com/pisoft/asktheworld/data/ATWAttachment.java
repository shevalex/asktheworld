package com.pisoft.asktheworld.data;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class ATWAttachment implements Serializable{
	private static final long serialVersionUID = 5857767204813951535L;

	@Column
	private String name;
	@Column
	private String url;
	@Column
	private String data;
	@Column
	private String type; //TODO: should be Enum?
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	
}
