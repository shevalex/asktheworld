package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.DateSerializer;


@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class ATWRequest implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1851088918684923954L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="id")
	@JsonIgnore
	private int request_id;

	@Column(updatable=false)
	private int user_id;
	@Column
	private String text;
	
	@Embedded
	@ElementCollection  //JFI: ElementCollection operation are always cascaded with EntityManager 
    //@CollectionTable(name = "ATWAttachment", joinColumns =@JoinColumn(name="request_id"))
	private List<ATWAttachment> attachments = new ArrayList<ATWAttachment>();

	@Column
	private int response_quantity;
	@Column
	private int response_wait_time;
	@Column
	private String response_age_group = "all"; //TODO: default value
	@Column
	private String response_gender = "all"; //TODO: default value
	@Column
	private String status = "active";
	@Column
	private String expertise_category;
	

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="UPDATE_TS", nullable = false)
	private Date modificationDate;
		     
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="CREATION_TS", nullable = false)
	@JsonSerialize(using = DateSerializer.class)
	private Date time;

	@Temporal(TemporalType.TIMESTAMP)
	@Column
	private Date expire_ts;
	
	public int getId() {
		return request_id;
	}
	public void setId(int id) {
		this.request_id = id;
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
	public List<ATWAttachment> getAttachments() {
		return attachments;
	}
	public void setAttachments(List<ATWAttachment> attachments) {
		this.attachments = attachments;
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
	public String getExpertise_category() {
		return expertise_category;
	}
	public void setExpertise_category(String expertise_category) {
		this.expertise_category = expertise_category;
	}
	
	@PrePersist
	void createdAt() {
		time = modificationDate = new Date();
		expire_ts = new Date(time.getTime()+response_wait_time*3600*1000);
	}

	@PreUpdate
	void updatedAt() {
		modificationDate = new Date();
	}
	
	@JsonIgnore
	public Date getTime() {
		return time;
	}
	@JsonIgnore
	public void setCreationTime(Date time) {
		this.time = time;
	}
	
	
	@JsonIgnore
	public Date getModificationDate() {
		return modificationDate;
	}
	
	public void updateCreationTime(Date time) {
		this.time = time;
		expire_ts = new Date(time.getTime()+response_wait_time*3600*1000);
	}

	@JsonIgnore
	public void setExpireTime(Date time) {
		expire_ts = time;
	}
	
	@JsonIgnore
	public Date getExpireTime() {
		return expire_ts;
	}
}
