package com.pisoft.asktheworld.data;

import java.io.Serializable;

public class User implements Serializable {
	private static int lastID = 0;
	/**
	 * 
	 */
	private static final long serialVersionUID = 927995499391295373L;
	private int id;
	private String login;
	private String password;
	private int birth_year;
	private String languages[];
	private String gender;

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
	public int getBirth_year() {
		return birth_year;
	}
	public void setBirth_year(int byear) {
		this.birth_year = byear;
	}
	public String[] getLanguages() {
		return languages;
	}
	public void setLanguages(String[] languages) {
		this.languages = languages;
	}
	
	
	public User createCopy() {
		User user  = new User();
		user.setLogin(getLogin());
		user.setGender(getGender());
		user.setBirth_year(getBirth_year());
		user.setLanguages(getLanguages());
		return user;
	}

}