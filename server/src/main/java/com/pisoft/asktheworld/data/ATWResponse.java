package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.CalendarSerializer;
import com.pisoft.asktheworld.enums.ContactInfoStatus;

@Entity
public class ATWResponse implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7326576865764446609L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonIgnore
	@Column
	private int id;
	
	@Column
	private int user_id;

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	@Column
	private int requestId;
	
	@Column
	private String text;
	
	@Embedded
	@ElementCollection  //JFI: ElementCollection operation are always cascaded with EntityManager 
	private List<ATWAttachment> attachments = new ArrayList<ATWAttachment>();
	
	@Column(columnDefinition="int4 default 0 not null") //TODO: need to add default value 
	private ContactInfoStatus contact_info_status = ContactInfoStatus.NO; //TODO: default value is not working
	
	@Column(nullable = false)
	private String status = "unviewed";
	
	@Column
	private int star_rating = 0;
	
	@Column(nullable = false)
	private String age_category;
	
	@Column(nullable = false)
	private String gender;
	
	@Column(nullable = false)
	@JsonIgnore
	private boolean deleted = false;
	

	@Version
	@Column(name="UPDATE_TS")
	//@JsonSerialize(using = CalendarSerializer.class)
	private Calendar modificationDate;
		     
	@Column(name="CREATION_TS", columnDefinition="TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable=false, updatable=false)
	@JsonSerialize(using = CalendarSerializer.class)
	private Calendar time;
	
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getStar_rating() {
		return star_rating;
	}

	public void setStar_rating(int star_rating) {
		this.star_rating = star_rating;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

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

	public int getRequestId() {
		return requestId;
	}

	public void setRequestId(int requestId) {
		this.requestId = requestId;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public ContactInfoStatus getContact_info_status() {
		return contact_info_status;
	}

	public void setContact_info_status(ContactInfoStatus contact_info_status) {
		this.contact_info_status = contact_info_status;
	}

	public List<ATWAttachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<ATWAttachment> attachments) {
		this.attachments = attachments;
	}

	public String getAge_category() {
		return age_category;
	}

	public void setAge_category(String age_category) {
		this.age_category = age_category;
	}
}