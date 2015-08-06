package com.pisoft.asktheworld.data;

import java.util.List;
import java.util.Set;

import javax.persistence.EntityTransaction;

import org.springframework.stereotype.Repository;

@Repository
public class ResponseDAOImpl extends AbstractDAO<ATWResponse> {
	private String findByRequestID = "select r from "+ATWResponse.class.getName()+" r where r.requestId=?1 and r.deleted=false";
	private String findByRequestAndUserID = "select r from "+ATWResponse.class.getName()+" r where r.requestId=?2 and r.user_id=?1";
	private String findByResponseAndUserID = "select r from "+ATWResponse.class.getName()+" r where r.id=?1 and r.user_id=?2";
	private String findByUserID = "select r from "+ATWResponse.class.getName()+" r where r.user_id=?1";
	private String findNewByUserIDAndTime = "select r.requestId from "+ATWResponse.class.getName()+" r where r.user_id=?1 and r.time > ?2 and r.time < ?3";
	//TODO: change to Event creation for pair (id, requestId). Now will return response objects 
	private String findModifiedByUserIDAndTime = "select r from "+ATWResponse.class.getName()+" r where r.user_id=?1 and r.modificationDate > ?2 and r.modificationDate < ?3";
	private String findNewByRequestsIdAndTime = "select r.requestId from "+ATWResponse.class.getName()+" r where r.requestId in :?1 and r.time > ?2 and r.time < ?3";
	//TODO: change to Event creation for pair (id, requestId). Now will return response objects
	private String findModifiedByRequestsIdAndTime = "select r from " + ATWResponse.class.getName()+" r where r.requestId in :?1 and r.modificationDate > ?2 and r.modificationDate < ?3";
	
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
	
	public ATWResponse markDeleted(ATWResponse response, boolean flag) {
		if(response != null && entityManager.contains(response)) {
			response.setDeleted(flag);
		}
		return response;
	}

	public List<ATWResponse> findByUserId(int user_id) {
		@SuppressWarnings("unchecked")
		List<ATWResponse> list =  entityManager.createQuery(findByUserID)
			.setParameter(1, user_id)
			.getResultList();
		return list;
	}
	
	public List<Integer> findNewOutgoingResponsesByUserIdAndDate(int user_id,
			long timeStamp, long timeRequest) {
		@SuppressWarnings("unchecked")
		List<Integer> list = entityManager.createQuery(findNewByUserIDAndTime,Integer.class)
				.setParameter(1, user_id)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;
	}

	public List<ATWResponse> findModifiedOutgoingRequestsByUserIdAndDate(int user_id,
			long timeStamp, long timeRequest) {
		@SuppressWarnings("unchecked")
		List<ATWResponse> list = entityManager.createQuery(findModifiedByUserIDAndTime)
				.setParameter(1, user_id)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;
	}

	public List<Integer> findNewResponsesByRequestsIdAndDate(Set<Integer> ids,
			long timeStamp, long timeRequest) {
		@SuppressWarnings("unchecked")
		List<Integer> list = entityManager.createQuery(findNewByRequestsIdAndTime ,Integer.class)
				.setParameter(1, ids)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;
	}

	public List<ATWResponse> findModifiedResponsesByRequestsIdAndDate(
			Set<Integer> ids, long timeStamp, long timeRequest) {
		@SuppressWarnings("unchecked")
		List<ATWResponse> list = entityManager.createQuery(findModifiedByRequestsIdAndTime)
				.setParameter(1, ids)
				.setParameter(2, timeStamp)
				.setParameter(3, timeRequest)
				.getResultList();
		return list;	
	}

}
