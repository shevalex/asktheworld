package com.pisoft.asktheworld.data;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class RequestDAOImpl extends AbstractDAO<ATWRequest> {
	private String findByUserIdQuery = "select r from " + ATWRequest.class.getName() + " r where r.user_id=?1 order by r.time DESC";
	private String findByUserIdAndStatusQuery = "select r from " + ATWRequest.class.getName() + " r where r.user_id=?1 and r.status=?2 order by r.time DESC";
	private String findForUserQuery = "select r from " + ATWRequest.class.getName() + " r where"+ 
			" r.user_id <> ?1 and " +
			" r.status = 'active' and "+
			" r.id not in ?2 and " +
			" r.response_age_group in ?3 and " +
			" r.response_gender in ?4";
	private String countByIdAndUserId = "select count(r) from "+ATWRequest.class.getName()+" r where r.id=?1 and r.user_id=?2";
	
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
	
	public List<ATWRequest> findNewIncomingRequets(int userId, List<Integer> userRequests, List<String> userAges, List<String> userGenders, int number) {
		@SuppressWarnings("unchecked")
		List<ATWRequest> list =  entityManager.createQuery(findForUserQuery)
				.setParameter(1, userId)
				.setParameter(2, userRequests)
				.setParameter(3, userAges)
				.setParameter(4, userGenders)
				.setMaxResults(number)
				.getResultList();
		if(list != null) {System.out.println("New requets list size = "+list.size());}
		else { System.out.println("New requets list is NULL");}
		return list;
	}
	
	public boolean exist(int requestID, int user_id) {
		long count = (long) entityManager.createQuery(countByIdAndUserId)
				.setParameter(1, requestID)
				.setParameter(2, user_id)
				.getSingleResult();
		System.out.println("Count of request with user id "+ count);
		return count >0;
	}

}