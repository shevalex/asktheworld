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
	private int byear;
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
	public int getByear() {
		return byear;
	}
	public void setByear(int byear) {
		this.byear = byear;
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
		user.setByear(getByear());
		user.setLanguages(getLanguages());
		return user;
	}

}