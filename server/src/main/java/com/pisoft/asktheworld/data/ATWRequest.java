package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class ATWRequest implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1851088918684923954L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonIgnore
	@Column(name="request_id")
	private int id;

	@Column
	private int user_id;
	@Column
	private String text;
	
	@Embedded
	@ElementCollection
    //@CollectionTable(name = "ATWPicture", joinColumns =@JoinColumn(name="request_id"))
	private List<ATWPicture> pictures = new ArrayList<ATWPicture>();

	@Embedded
	@ElementCollection
    //@CollectionTable(name = "ATWAudio", joinColumns = @JoinColumn(name="request_id"))
	private List<ATWAudio> audios = new ArrayList<ATWAudio>();

	@Column
	private int response_quantity;
	@Column
	private int response_wait_time;
	@Column
	private String response_age_group;
	@Column
	private String response_gender;
	@Column
	private String status;
	

	@Version
	@Column(name="UPDATE_TS")
	private Calendar modificationDate;
		     
	@Column(name="CREATION_TS", columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable=false, updatable=false)
	private Calendar creationDate;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public List<ATWPicture> getPictures() {
		return pictures;
	}
	public void setPictures(List<ATWPicture> pictures) {
		this.pictures = pictures;
	}
	public List<ATWAudio> getAudios() {
		return audios;
	}
	public void setAudios(List<ATWAudio> audios) {
		this.audios = audios;
	}
	public int getResponse_quantity() {
		return response_quantity;
	}
	public void setResponse_quantity(int response_quantity) {
		this.response_quantity = response_quantity;
	}
	public int getResponse_wait_time() {
		return response_wait_time;
	}
	public void setResponse_wait_time(int response_wait_time) {
		this.response_wait_time = response_wait_time;
	}
	public String getResponse_age_group() {
		return response_age_group;
	}
	public void setResponse_age_group(String response_age_group) {
		this.response_age_group = response_age_group;
	}
	public String getResponse_gender() {
		return response_gender;
	}
	public void setResponse_gender(String response_gender) {
		this.response_gender = response_gender;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}
