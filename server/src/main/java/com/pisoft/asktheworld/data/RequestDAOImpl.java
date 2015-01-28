package com.pisoft.asktheworld.data;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class RequestDAOImpl extends AbstractDAO<ATWRequest> {
	private String findByUserIdQuery = "select r from " + ATWRequest.class.getName() + " r where r.user_id=?1";
	public RequestDAOImpl() {
		super();
		setTClass(ATWRequest.class);
		System.out.println("REQUEST SETINGS DAO CREATED");
	}

	public List<ATWRequest> findRequestsByUserId(int id) {
		@SuppressWarnings("unchecked")
		List<ATWRequest> list =  entityManager.createQuery(findByUserIdQuery)
			.setParameter(1, id)
			.getResultList();
		if(list != null) {System.out.println("List size = "+list.size());}
		else { System.out.println("List is NULL");}
		return list;
	}
}