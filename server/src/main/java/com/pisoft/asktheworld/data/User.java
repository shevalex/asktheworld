package com.pisoft.asktheworld.data;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class User implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 927995499391295373L;
	@JsonIgnore	private int id;
	private String login;
	private String password;
	private String languages[];
	private String gender;
	private String name;
	private String age_category;

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
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String[] getLanguages() {
		return languages;
	}
	public void setLanguages(String[] languages) {
		this.languages = languages;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	public User createCopy() {
		User user  = new User();
		user.setId(getId());
		user.setLogin(getLogin());
		user.setGender(getGender());
		user.setAge_category(getAge_category());
		user.setLanguages(getLanguages());
		user.setName(getName());
		return user;
	}
	public String getAge_category() {
		return age_category;
	}
	public void setAge_category(String age_category) {
		this.age_category = age_category;
	}
}