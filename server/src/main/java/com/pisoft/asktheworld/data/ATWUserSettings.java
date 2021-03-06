package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

import org.hibernate.annotations.Parameter;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ATWUserSettings implements Serializable {
/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column
	@JsonIgnore	
	private int id;
	
	@Column
	private String default_gender_preference = "all";
	//”: [“teens”, “adult”, “senior”],
	@Column
	private int	default_response_quantity = 5;
	@Column
	private int default_response_wait_time = 1; //hour  
	@Column
	String default_response_age_group_preference = "all";
	//”: [“teens”, “adult”, “senior”],  
	@Column
	private int inquiry_quantity_per_day = 5;
	@Column
	private String inquiry_gender_preference = "all";
	@Column
	private String inquiry_age_group_preference = "all";
	//[“teens”, “adult”, “senior”]
	@Column
	private String expertises[] = {"general"};

	
	@org.hibernate.annotations.Type(
	        type = "org.hibernate.type.SerializableToBlobType", 
	        parameters = { @Parameter( name = "classname", value = "java.util.HashMap" ) })
	@Column(nullable = false)
	private Map<String, Map<String, Object>>paid_features = new LinkedHashMap<String, Map<String,Object>>();

	public Map<String, Map<String, Object>> getPaid_features() {
		return paid_features;
	}
	public void setPaid_features(Map<String, Map<String, Object>> paid_features) {
		this.paid_features = paid_features;
	}
	public String[] getExpertises() {
		return expertises;
	}
	public void setExpertises(String[] expertises) {
		this.expertises = expertises;
	}

	public String getDefault_gender_preference() {
		return default_gender_preference;
	}
	public void setDefault_gender_preference(String default_gender_preference) {
		this.default_gender_preference = default_gender_preference;
	}
	public int getDefault_response_quantity() {
		return default_response_quantity;
	}
	public void setDefault_response_quantity(int default_response_quantity) {
		this.default_response_quantity = default_response_quantity;
	}
	public int getDefault_response_wait_time() {
		return default_response_wait_time;
	}
	public void setDefault_response_wait_time(int default_response_wait_time) {
		this.default_response_wait_time = default_response_wait_time;
	}
	public String getDefault_response_age_group_preference() {
		return default_response_age_group_preference;
	}
	public void setDefault_response_age_group_preference(
			String default_response_age_group_preference) {
		this.default_response_age_group_preference = default_response_age_group_preference;
	}
	public int getInquiry_quantity_per_day() {
		return inquiry_quantity_per_day;
	}
	public void setInquiry_quantity_per_day(int inquiry_quantity_per_day) {
		this.inquiry_quantity_per_day = inquiry_quantity_per_day;
	}
	public String getInquiry_gender_preference() {
		return inquiry_gender_preference;
	}
	public void setInquiry_gender_preference(String inquiry_gender_preference) {
		this.inquiry_gender_preference = inquiry_gender_preference;
	}
	public String getInquiry_age_group_preference() {
		return inquiry_age_group_preference;
	}
	public void setInquiry_age_group_preference(String inquiry_age_group_preference) {
		this.inquiry_age_group_preference = inquiry_age_group_preference;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}	
	
	public ATWUserSettings copy() {
		ATWUserSettings userSettings = new ATWUserSettings();
		
		//check fields
		if ( default_response_quantity >= -1 && default_response_quantity < 1000) userSettings.setDefault_response_quantity(default_response_quantity);
		if (default_response_wait_time >= -1 ) userSettings.setDefault_response_wait_time(default_response_wait_time);
		userSettings.setDefault_response_age_group_preference(default_response_age_group_preference);
		userSettings.setDefault_gender_preference(default_gender_preference);
		//”: [“teens”, “adult”, “senior”],  
		if (inquiry_quantity_per_day >= -1 ) userSettings.setInquiry_quantity_per_day(inquiry_quantity_per_day);
		userSettings.setInquiry_gender_preference(inquiry_gender_preference);
		userSettings.setInquiry_age_group_preference(inquiry_age_group_preference);	
		
		//[“teens”, “adult”, “senior”]
		
		return userSettings;
	}
	
	@Override
	public String toString() {
		return "id="+id+"; default_response_quantity="+default_response_quantity+"; default_response_wait_time="+default_response_wait_time+"; and etc";
	}
}


