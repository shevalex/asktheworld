package com.pisoft.asktheworld.data;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class RequestDAOImpl extends AbstractDAO<ATWRequest> {
	private String findByUserIdQuery = "select r from " + ATWRequest.class.getName() + " r where r.user_id=?1 order by r.creationDate DESC";
	private String findByUserIdAndStatusQuery = "select r from " + ATWRequest.class.getName() + " r where r.user_id=?1 and r.status=?2 order by r.creationDate DESC";
	public RequestDAOImpl() {
		super();
		setTClass(ATWRequest.class);
		System.out.println("REQUEST SETINGS DAO CREATED");
	}

	public List<ATWRequest> findOutgoingRequestsByUserId(int id, String sorting) {
		@SuppressWarnings("unchecked")
		//TODO: update sql request with sorting option. Now just by date 
		List<ATWRequest> list =  entityManager.createQuery(findByUserIdQuery)
			.setParameter(1, id)
			.getResultList();
		if(list != null) {System.out.println("List size = "+list.size());}
		else { System.out.println("List is NULL");}
		return list;
	}
	
	public List<ATWRequest> findOutgoingRequestsByUserId(int id, String status, String sorting) {
		@SuppressWarnings("unchecked")
		//TODO: update sql request with sorting option. Now just by date 
		List<ATWRequest> list =  entityManager.createQuery(findByUserIdAndStatusQuery)
			.setParameter(1, id)
			.setParameter(2, status)
			.getResultList();
		if(list != null) {System.out.println("List size = "+list.size());}
		else { System.out.println("List is NULL");}
		return list;
	}
}
