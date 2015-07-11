package com.pisoft.asktheworld.data;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class ResponseDAOImpl extends AbstractDAO<ATWResponse> {
	private String findByRequestID = "select r from "+ATWResponse.class.getName()+" r where r.requestId=?1 and where r.deleted=false";
	private String findByRequestAndUserID = "select r from "+ATWResponse.class.getName()+" r where r.requestId=?2 and r.user_id=?1";
	private String findByResponseAndUserID = "select r from "+ATWResponse.class.getName()+" r where r.id=?1 and r.user_id=?2";

	public ResponseDAOImpl() {
		super();
		setTClass(ATWResponse.class);
		System.out.println("RESPONSE DAO CREATED");
	}

	public List<ATWResponse> findResponsesByUserIdAndRequestId(int user_id,
			int requestID) {
		//TODO: update sql request with sorting option. Now just by date 
		@SuppressWarnings("unchecked")
		List<ATWResponse> list =  entityManager.createQuery(findByRequestAndUserID)
			.setParameter(1, user_id )
			.setParameter(2, requestID)
			.getResultList();
		if(list != null) {System.out.println("Response by rid and uid List size = "+list.size());}
		else { System.out.println("Response List by rid and uid is NULL");}
		return list;
	}

	public List<ATWResponse> findResponsesByRequestId(int requestID) {
		//TODO: update sql request with sorting option. Now just by date 
		@SuppressWarnings("unchecked")
		List<ATWResponse> list =  entityManager.createQuery(findByRequestID)
			.setParameter(1, requestID)
			.getResultList();
		if(list != null) {System.out.println("Response by rid List size = "+list.size());}
		else { System.out.println("Response List is by rid NULL");}
		return list;
	}
	
	public ATWResponse markDeleted(int responseID, int user_id, boolean flag) {
		entityManager.getTransaction().begin();
		ATWResponse r = (ATWResponse) entityManager.createQuery(findByResponseAndUserID)
		.setParameter(1, responseID)
		.setParameter(2, user_id)
		.getSingleResult();
		//ATWResponse r = entityManager.find(ATWResponse.class, responseID);
		//if(r!=null && r.getUser_id() == user_id){ //TODO: not sure that this is good idea to check user_id. this is business logic 
		if(r!=null) {
			r.setDeleted(flag);
		}
		entityManager.getTransaction().commit();
		return r;
	}

}
