package com.pisoft.asktheworld.data;

import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityTransaction;

import org.springframework.stereotype.Repository;

@Repository
public class ResponseDAOImpl extends AbstractDAO<ATWResponse> {
	private String findByRequestID = "select r from "+ATWResponse.class.getName()+" r where r.request_id=?1 and r.deleted=false";
	private String findByRequestAndUserID = "select r from "+ATWResponse.class.getName()+" r where r.request_id=?2 and r.user_id=?1";
	private String findByResponseAndUserID = "select r from "+ATWResponse.class.getName()+" r where r.id=?1 and r.user_id=?2";
	private String findByUserID = "select r from "+ATWResponse.class.getName()+" r where r.user_id=?1";
	private String findNewByUserIDAndTime = "select r.request_id from "+ATWResponse.class.getName()+" r where r.user_id=?1 and r.time between ?2 and ?3";
	//TODO: change to Event creation for pair (id, requestId). Now will return response objects 
	private String findModifiedByUserIDAndTime = "select r from "+ATWResponse.class.getName()+" r where r.user_id=?1 and r.modificationDate between ?2 and ?3";
	private String findNewByRequestsIdAndTime = "select r.request_id from "+ATWResponse.class.getName()+" r where r.request_id in ?1 and r.time between ?2 and ?3";
	//TODO: change to Event creation for pair (id, requestId). Now will return response objects
	private String findModifiedByRequestsIdAndTime = "select r from " + ATWResponse.class.getName()+" r where r.request_id in ?1 and r.modificationDate between ?2 and ?3";
	
	private String findSatusChangeddByRequestsIdAndTime = "select r from " + ATWResponse.class.getName()+" r where r.request_id in ?1 and r.statusUpdateTime between ?2 and ?3";
	
	private String findNewOrStatusChangedByRequestsIdAndTime = "select r.request_id from "+ATWResponse.class.getName()+" r where r.request_id in ?1 and r.time between ?2 and ?3 or r.statusUpdateTime between ?2 and ?3";
	public ResponseDAOImpl() {
		super();
		setTClass(ATWResponse.class);
		System.out.println("RESPONSE DAO CREATED");
	}

	public List<ATWResponse> findResponsesByUserIdAndRequestId(int userId,
			int requestID) {
		//TODO: update sql request with sorting option. Now just by date 
		@SuppressWarnings("unchecked")
		List<ATWResponse> list =  entityManager.createQuery(findByRequestAndUserID)
			.setParameter(1, userId )
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
	
	public ATWResponse markDeleted(ATWResponse response, boolean flag) {
		if(response != null && entityManager.contains(response)) {
			response.setDeleted(flag);
		}
		return response;
	}

	public List<ATWResponse> findByUserId(int userId) {
		@SuppressWarnings("unchecked")
		List<ATWResponse> list =  entityManager.createQuery(findByUserID)
			.setParameter(1, userId)
			.getResultList();
		return list;
	}
	
	public List<Integer> findNewOutgoingResponsesByUserIdAndDate(int userId,
			Date timeStamp, Date timeRequest) {
		@SuppressWarnings("unchecked")
		List<Integer> list = entityManager.createQuery(findNewByUserIDAndTime,Integer.class)
				.setParameter(1, userId)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;
	}

	public List<ATWResponse> findModifiedOutgoingRequestsByUserIdAndDate(int userId,
			Date timeStamp, Date timeRequest) {
		@SuppressWarnings("unchecked")
		List<ATWResponse> list = entityManager.createQuery(findModifiedByUserIDAndTime)
				.setParameter(1, userId)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;
	}

	public List<Integer> findNewResponsesByRequestsIdAndDate(Set<Integer> ids,
			Date timeStamp, Date timeRequest) {
		@SuppressWarnings("unchecked")
		List<Integer> list = entityManager.createQuery(findNewByRequestsIdAndTime ,Integer.class)
				.setParameter(1, ids)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;
	}

	public List<ATWResponse> findModifiedResponsesByRequestsIdAndDate(
			Set<Integer> ids, Date timeStamp, Date timeRequest) {
		@SuppressWarnings("unchecked")
		List<ATWResponse> list = entityManager.createQuery(findModifiedByRequestsIdAndTime)
				.setParameter(1, ids)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;	
	}
	
	public List<Integer> findNewOrStatusChangedResponsesByRequestsIdAndDate(
			Set<Integer> ids, Date timeStamp, Date timeRequest) {
		@SuppressWarnings("unchecked")
		List<Integer> list = entityManager.createQuery(findNewOrStatusChangedByRequestsIdAndTime, Integer.class)
				.setParameter(1, ids)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;	
	}
	

}
