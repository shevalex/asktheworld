package com.pisoft.asktheworld.data;

import java.io.Serializable;

public class UserSettings implements Serializable {
/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int	default_response_quantity = 5;
	private int default_response_wait_time = 1; //hour  
	String default_response_age_group_preference;
	//”: [“teens”, “adult”, “senior”],  
	private int inquary_quantity_per_day = 5;
	private String inquary_gender_preference = "any";
	private String inquary_age_group_preference;
	//[“teens”, “adult”, “senior”]

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
	public int getInquary_quantity_per_day() {
		return inquary_quantity_per_day;
	}
	public void setInquary_quantity_per_day(int inquary_quantity_per_day) {
		this.inquary_quantity_per_day = inquary_quantity_per_day;
	}
	public String getInquary_gender_preference() {
		return inquary_gender_preference;
	}
	public void setInquary_gender_preference(String inquary_gender_preference) {
		this.inquary_gender_preference = inquary_gender_preference;
	}
	public String getInquary_age_group_preference() {
		return inquary_age_group_preference;
	}
	public void setInquary_age_group_preference(String inquary_age_group_preference) {
		this.inquary_age_group_preference = inquary_age_group_preference;
	}
	
	public UserSettings copy() {
		UserSettings userSettings = new UserSettings();
		
		//check fields
		if ( default_response_quantity > 0 && default_response_quantity < 1000) userSettings.setDefault_response_quantity(default_response_quantity);
		if (default_response_wait_time > 0 ) userSettings.setDefault_response_wait_time(default_response_wait_time);
		userSettings.setDefault_response_age_group_preference(default_response_age_group_preference);
		//”: [“teens”, “adult”, “senior”],  
		if (inquary_quantity_per_day > 0 ) userSettings.setInquary_quantity_per_day(inquary_quantity_per_day);
		userSettings.setInquary_gender_preference(inquary_gender_preference);
		userSettings.setInquary_age_group_preference(inquary_age_group_preference);	
		//[“teens”, “adult”, “senior”]
		
		return userSettings;
	}
	
	
	
}


