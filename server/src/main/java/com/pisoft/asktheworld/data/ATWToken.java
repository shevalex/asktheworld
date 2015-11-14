package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ATWToken implements Serializable {
 
	/**
	 * 
	 */
	private static final long serialVersionUID = 4900269934145986150L;

	private static final long resetExpirationTime = 60*60*1000; //60 minutes
	
	
	@Id
	@Column(name="id")
	@JsonIgnore	
	private int user_id;
	
	@Column(name="token")
	String token;
	
	@Column(name="email")
	String email;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="EXPIRE_TS", nullable = false)
	private Date expire_ts;
	
	public ATWToken() {
		super();
	}
	
	public ATWToken(ATWUser user) {
		this.email = user.getLogin();
		user_id = user.getUser_id();
		update();
	}
	
	public void update(){
		token = UUID.randomUUID().toString().replaceAll("-", "");
		expire_ts = new Date(new Date().getTime()+resetExpirationTime);
	}
		
	public String getEmail() {
		return email;
	}

	public String getToken() {
		return token;
	}

	public Date getExpirationDate() {
		return expire_ts;
	}
	
	
}
