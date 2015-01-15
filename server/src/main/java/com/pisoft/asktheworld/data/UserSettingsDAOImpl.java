package com.pisoft.asktheworld.data;

import org.springframework.stereotype.Repository;

@Repository
public class UserSettingsDAOImpl extends AbstractDAO<ATWUserSettings> {
	public UserSettingsDAOImpl() {
		super();
		setTClass(ATWUserSettings.class);
		System.out.println("USER SETINGS DAO CREATED");
	}
}
