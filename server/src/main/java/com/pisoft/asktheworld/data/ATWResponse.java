package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.DateSerializer;
import com.pisoft.asktheworld.enums.ContactInfoStatus;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class ATWResponse implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7326576865764446609L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonIgnore
	@Column(name="id")
	private int response_id;
	
	@Column(updatable=false)
	private int user_id;

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	@Column(updatable=false)
	private int request_id;
	
	@Column
	private String text;
	
	@Embedded
	@ElementCollection  //JFI: ElementCollection operation are always cascaded with EntityManager 
	private List<ATWAttachment> attachments = new ArrayList<ATWAttachment>();

	@Column(nullable = false)
	private String status = "unviewed";
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="UPDATE_STATUS_TS")
	private Date statusUpdateTime;
	
	@Column
	private int star_rating = 0;
	
	@Column(nullable = false)
	private String age_category;
	
	@Column(nullable = false)
	private String gender;
	
	@Column(nullable = false)
	@JsonIgnore
	private boolean deleted = false;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="UPDATE_TS", nullable = false)
	private Date modificationDate;
		     
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="CREATION_TS", nullable = false, updatable=false)
	@JsonSerialize(using = DateSerializer.class)
	private Date time;
	
	@org.hibernate.annotations.Type(
	        type = "org.hibernate.type.SerializableToBlobType", 
	        parameters = { @Parameter( name = "classname", value = "java.util.HashMap" ) })
	@Column(nullable = false)
	private Map<String, Map<String, Object>>paid_features = null;

	@Transient
	private boolean provideAll = false;
	
	//We will remove data in json if status is not provided
	public Map<String, Map<String, Object>> getPaid_features() {
		if (paid_features == null) return null;
		if (provideAll) return paid_features;
		for(Entry<String, Map<String, Object>> feature : paid_features.entrySet()) {
			Map<String, Object> map = feature.getValue();
			if(!map.get("status").equals("provided")) {
				map.remove("data");
			}
		}
		return paid_features;
	}

	@JsonIgnore
	public void setPaidStatus(String feature) {
		Map<String, Object> map = paid_features.get(feature);
		if(map != null) {
			map.put("status", "provided");
		}
	}

	
	public void setPaid_features(Map<String, Map<String, Object>> paid_features) {
		this.paid_features = paid_features;
	}

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
		return response_id;
	}

	public void setId(int id) {
		this.response_id = id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public int getRequest_id() {
		return request_id;
	}

	public void setRequest_id(int requestId) {
		this.request_id = requestId;
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

	public String getAge_category() {
		return age_category;
	}

	public void setAge_category(String age_category) {
		this.age_category = age_category;
	}
	
	@PrePersist
	void createdAt() {
		time = modificationDate = new Date();
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
	
	@JsonIgnore
	public Date getStatusChangeDate() {
		return statusUpdateTime;
	}

	@JsonIgnore
	public void setStatusChangeDate() {
		statusUpdateTime = new Date();
	}

	@JsonIgnore
	public void setStatusChangeDate(Date time) {
		statusUpdateTime = time;
	}


	@JsonIgnore
	public void provideAllFileds() {
		this.provideAll  = true;
		
	}

}
