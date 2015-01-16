package com.pisoft.asktheworld.data;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class ATWAudio implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -569501494549470389L;
	@Column
	private String audio;
	@Column
	private String description;
	public String getAudio() {
		return audio;
	}
	public void setAudio(String audio) {
		this.audio = audio;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
}
