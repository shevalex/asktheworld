package com.pisoft.asktheworld.data;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class ATWPicture implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 209733291195973911L;
	@Column
	private String picture;
	@Column
	private String description;
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
}
