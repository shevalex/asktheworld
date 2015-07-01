package com.pisoft.asktheworld.data;


import java.util.List;

import org.springframework.stereotype.Repository;

import com.pisoft.asktheworld.enums.AgeRequest;
import com.pisoft.asktheworld.enums.Gender;

@Repository
public class UserDAOImpl extends AbstractDAO<ATWUser>{
	private String findByLoginQuery = "select u from " + ATWUser.class.getName() + " u where u.login=?1";
	//private Class<ATWUser> tClass = ATWUser.class;

	//@PersistenceContext
	//protected EntityManager entityManager;

	public UserDAOImpl(){
		super();
		setTClass(ATWUser.class);
		System.out.println("CREATED");
		//DB.getInstance().setUserDAO(this);
	}
	
	public ATWUser findByLogin(String login) {
		@SuppressWarnings("unchecked")
		List<ATWUser> list =  entityManager.createQuery(findByLoginQuery)
				.setParameter(1, login)
				.getResultList();
		if(list == null || list.isEmpty() ) {System.out.println("User " + login +" not found");return null;}
		System.out.println(list.get(0).getName() + "   " + list.get(0).getPassword());
		return list.get(0);

	}

	private String findUserByAgeAndGender = "select u from " + ATWUser.class.getName() + " u where"+ 
			" u.age_category like ?1 and " +
			" ( u.gender = ?2 or ?2 is null )"; //Fucking magic!

	public List<ATWUser> findUserByAgeAndGender(AgeRequest age, Gender gender) {
		@SuppressWarnings("unchecked")
		List<ATWUser> list =  entityManager.createQuery(findUserByAgeAndGender)
				.setParameter(1, age.toQueryString()) //TODO: change age category to enum (int) 
				.setParameter(2, gender)
				.getResultList();
		//TODO: Clean this up
		if(list != null) {System.out.println("New requets list size = "+list.size());}
		else { System.out.println("New requets list is NULL");}
		return list;
	}
}
