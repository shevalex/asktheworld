package com.pisoft.asktheworld.data;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.pisoft.asktheworld.enums.AgeRequest;
import com.pisoft.asktheworld.enums.Gender;
import com.pisoft.asktheworld.enums.RequestStatus;
import com.pisoft.asktheworld.enums.ResponseStatus;

@Service
@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
public class DB {
	public boolean verifyString(String str) {return str != null && str.length() > 3;}
	public boolean verifyYear(int year) { return year > 1900 && year < 2100;}
	public boolean verifyLangs(String langs[]) { return langs != null && langs.length > 0;}
	public boolean verifyAge(String str) {return true;}
	//static DB db = new DB();
	//int lastId = 0;
	//Map<String, Integer> names = new HashMap<String, Integer>();
	//Map<Integer,User> users = new HashMap<Integer,User>();
	
	//TODO: Should be configurable 
	private static float NUMBER_USERS_MULTIPLICATOR = 1.2f; 
	private static int MAX_NUMBER_USERS_PER_REQUEST = 1000;
	
	
	private static int getRequiredUsersNumber(int required){
		if (required <= 0 ){
			return  MAX_NUMBER_USERS_PER_REQUEST;
		}
		return Math.min(MAX_NUMBER_USERS_PER_REQUEST, Math.round(NUMBER_USERS_MULTIPLICATOR*required));
	} 
	
	public DB() {
		System.out.println("DB CREATED");
	}
	
	@Autowired
	private UserDAOImpl users;
	@Autowired
	private UserSettingsDAOImpl settings;
	@Autowired
	private RequestDAOImpl requests;
	@Autowired
	private ResponseDAOImpl responses;

	
	
	public ATWUser getUser(int id) {
		return users.findById(id);
	}
	public boolean isUserExist(int id){
		return users.exist(id);
	}
	public ATWUser findUser(String login) {
		ATWUser u = users.findByLogin(login);
		return u;
	}
	
	public ATWUser addUser(ATWUser user) {
		if (findUser(user.getLogin()) == null) {
			users.create(user);
			ATWUserSettings userSettings = new ATWUserSettings();
			userSettings.setId(user.getUser_id());
			settings.create(userSettings);
			System.out.println("USer setting created with id " + userSettings.getId());
			return user;
		}
		return null;
	}
	
	public ATWUser deleteUser(int id) {
		ATWUser user = getUser(id);
		if( user != null) {
			users.deleteById(id);
			settings.deleteById(id);
		}
		return user;
	}
	
	
	public ATWUser updateUser(ATWUser user){
		if(isUserExist(user.getUser_id())) {
			return users.update(user);
		}
		return null;
/*		ATWUser existUser = getUser(user.getUser_id());
 		if( existUser != null) {
			if(verifyString(user.getPassword())) existUser.setPassword(user.getPassword());
			//if(verifyString(user.getGender())) existUser.setGender(user.getGender());
			if(verifyAge(user.getAge_category())) existUser.setAge_category(user.getAge_category());
			if(verifyLangs(user.getLanguages())) existUser.setLanguages(user.getLanguages());
			users.update(existUser);
		}
		return existUser;
/**/		
	}
	
	
	public int[] getIDs(){
		List<ATWUser> allUsers = users.findAll();
		int ids[] = new int[allUsers.size()];
		int i = 0;
		for(Iterator<ATWUser> it = allUsers.iterator(); it.hasNext(); ids[i++] = it.next().getUser_id());
		return ids;
	}
	
	public ATWUser[] getUsers() {
		List<ATWUser> allUsers = users.findAll();
		return allUsers.toArray(new ATWUser[allUsers.size()]);
	}

	//User settings
	
	public ATWUserSettings updateUserSettings(ATWUserSettings userSettings) {
		ATWUserSettings existUserSettings = getUserSettings(userSettings.getId());
		if(existUserSettings != null) {
			existUserSettings = settings.update(userSettings);
		}
		return existUserSettings;
	}
	
	public ATWUserSettings getUserSettings(int id) {
		return settings.findById(id);
	}
	public ATWRequest addRequest(ATWRequest request) {
		requests.create(request);
		//Assign it to right users
		//Find users base on request
		List<ATWUser> users = findIncomingRequestUsers(request);
		System.out.println("USER List size: "+users!=null?users.size():"null");
		//TODO: shuffle ?
		
		//TODO: what we should do if list is empty or smaller than user wants?
		if(users != null && users.size() > 0) {
			int counter = 0;
			int max = getRequiredUsersNumber(request.getResponse_quantity());
			for(Iterator<ATWUser> it = users.iterator(); it.hasNext();) {
				ATWUser user = it.next();
				//skip current user
				if(user.getUser_id() == request.getUser_id()) continue;
				//TODO: filter base on number requests per day
				
				//assign request to users
				user.addRequets(request);
				//TODO: Looks like it should be atomic save for all users? to save DB resources
				updateUser(user);
				counter++;
				if (counter >= max) break;
			}
		}else {
			System.out.println("List is empty or null");
		}
		return request;
	}

	private List<ATWUser> findIncomingRequestUsers(ATWRequest request) {
		String gender = request.getResponse_gender();
		String age = request.getResponse_age_group();
		AgeRequest ar = AgeRequest.forValue(age); //TODO: MUST use Age enum
		Gender gr = Gender.forValue(gender);
		
		System.out.println("Gender "+gender + "    Age "+ age + " Enums: Age=" + ar + "  Gender=" + gr);
		return users.findUserByAgeAndGender(ar, gr);
		
	}
	public ATWRequest getRequest(int id) {
		requests.updateExpiredRequests(new Date());
		return requests.findById(id);
	}
	
	public boolean isRequestExist(int id) {
		return requests.exist(id);
	}
	
	public ATWRequest deleteRequest(int id){
		ATWRequest request = getRequest(id);
		if(request != null) {
			requests.deleteById(id);
		}
		return request;
	}
	public ATWRequest updateRequest(ATWRequest request) {
		//get stored object
		Date requestTime = new Date();
		requests.updateExpiredRequests(requestTime);
		ATWRequest storedReq = requests.findById(request.getId());
		if (storedReq != null && storedReq.getStatus().equals("active")) {
			//compare waiting time

			if (storedReq.getResponse_wait_time() != request.getResponse_wait_time()) {
				request.updateCreationTime(requestTime);
			}
			if (!storedReq.getStatus().equals(request.getStatus())) {
				request.setExpireTime(requestTime);
			}
			return requests.update(request);
		}
		return null;
	}
	
	
	/**
	 * getUserOutgoingRequestsIDs returns sorted list of outgoing requests ids for 
	 * particular user base on status and 
	 * @param id - user id 
	 * @param status - required request status [active, archived, deleted, expired]
	 * @param sorting - sorting field. Now we support just creation time sorting  
	 * @return list of outgoing requests ids or empty list 
	 */
	public ATWUser getUserOutgoingRequestsIDs(int id, String status, String sorting, List<Integer> active, List<Integer> inactive) {
		ATWUser user = getUser(id);
		if(user == null) return null;
		RequestStatus rStatus = RequestStatus.forValue(status);
		List<ATWRequest> listRequests = findUserOutgoingRequests(id, rStatus, sorting);
		fillRequestsArrays(listRequests,  rStatus, active, inactive);
		return user;
	}

	public List<ATWRequest> findUserOutgoingRequests(int id, RequestStatus status, String sorting) {
		//test it here not necessary but leave it for protection now
		ATWUser existUser = getUser(id);
		List<ATWRequest> list = null;
		requests.updateExpiredRequests(new Date());
		if(existUser != null) {
			if(status == RequestStatus.ALL) {
				list = requests.findOutgoingRequestsByUserId(id, sorting);
			} else {
				list = requests.findOutgoingRequestsByUserId(id, status.toValue(), sorting);
			}
		}
		return list;
	}
	
	
	/**
	 * Return sorted list of incoming requests ids with particular status for user
	 * @param id user id
	 * @param status status of request
	 * @param sorting is not supported yet
	 * @return list of ids or empty list
	 */
	public ATWUser getUserIncomingRequestsIDs(int id, String status, String sorting, List<Integer> active, List<Integer> inactive) {
		//TODO: add support for sorting
		//TODO: move selecting and sorting into DAO layer? 
		ATWUser user = getUser(id);
		if ( user == null) return user;
		RequestStatus rStatus = RequestStatus.forValue(status);
		System.out.println("User id="+id+"  status "+status);
		List<ATWRequest> requests = user.getIncomingRequests();
		fillRequestsArrays(requests, rStatus, active, inactive);
		return user;
	}

	/**
	 * Method assigns additional number requests to user
	 * @param user - to assign new requests
	 * @param number - number of new requests
	 * @return list of assigned requests ids. 
	 */
	public List<Integer> getAdditionalIncomingRequestsIDs(ATWUser user, int number) {
		List<ATWRequest> requests = getNewIncomingRequests(user, number);
		List<Integer> requestsIDs = new ArrayList<Integer>();
		if(requests != null) {
			for(Iterator<ATWRequest> it = requests.iterator(); it.hasNext(); ){
				ATWRequest r = it.next();
				user.addRequets(r);
				requestsIDs.add(r.getId());
			}
			//save in DB
			updateUser(user);
		}
		return requestsIDs;
	}
	
	//I am not sure that we need this function
	//public void addRequestToUser(int userId, int requestId){}
	
	
	/**
	 * Methods searches for number new incoming request for user  
	 * @param user
	 * @return
	 */
	private List<ATWRequest> getNewIncomingRequests(ATWUser user, int number){
		int id = user.getUser_id();
		//TODO: we need to optimize here. This list will grow up. Probably we need just Active request here
		List<Integer> userIncomingRequests = user.getIncomingRequestsIDs();
		//List should not be empty
		userIncomingRequests.add(0);
		List<String> userAges = new ArrayList<String>(); 
		userAges.add(user.getAge_category());
		userAges.add("All");
		List<String> userGenders = new ArrayList<String>();
		userGenders.add(user.getGender().toString());
		userGenders.add("All");
		requests.updateExpiredRequests(new Date());
		List<ATWRequest> newIncomingRequests = requests.findNewIncomingRequets(id, userIncomingRequests, userAges, userGenders, number);
		return newIncomingRequests;
	}


	public ATWRequest deleteUserIncomingRequests(int userId, int requestId) {
		ATWUser user = users.findById(userId);
		if ( user == null ) {
			//Really we should not be here, as we check user id and credentials in security
			return null;
		}

		//For now we will got trough request in user list and compare request id
		//TODO: objects are same if they have same id (implement equal method)
		List<ATWRequest> list = user.getIncomingRequests();
		for (Iterator<ATWRequest> it = list.iterator(); it.hasNext();) {
			ATWRequest request = it.next();
			if ( request.getId() == requestId ) {
				request = user.deleteRequest(request);
				users.update(user);
				return request;
			}
		}
		return null;
	}
	
	private void fillRequestsArrays(List<ATWRequest> requests, RequestStatus status, List<Integer> active, List<Integer> inactive) {
		if(status == RequestStatus.ALL) {
			for(Iterator<ATWRequest> it = requests.iterator(); it.hasNext(); ) {
				ATWRequest r = it.next();
				RequestStatus currStat = RequestStatus.forValue(r.getStatus());
				if (RequestStatus.ACTIVE == currStat) {
					active.add(r.getId());
				}
				if (RequestStatus.INACTIVE == currStat) {
					inactive.add(r.getId());
				}
			} //end for
		} else {
			//this list should not be null
			for(Iterator<ATWRequest> it = requests.iterator(); it.hasNext(); ) {
				ATWRequest r = it.next();
				if (status == RequestStatus.forValue(r.getStatus())) {
					if (status == RequestStatus.ACTIVE)
						active.add(r.getId());
					else
						inactive.add(r.getId());
				}
			} //end for
		}		
	}
	public ATWResponse addResponse(ATWResponse response) {
		responses.create(response);
		return response;
	}
	public ATWResponse updateResponse(ATWResponse response) {
		//get stored object
		ATWResponse resp = responses.findById(response.getId());
		if(resp != null) {
			//compare statuses
			if (response.getStatus() != null && !resp.getStatus().equals(response.getStatus())) {
				response.setStatusChangeDate();
			} else {
				response.setStatusChangeDate(resp.getStatusChangeDate());
			}
			resp = responses.update(response);
			return resp;
		}
		return null;		
	}
	
	public ATWResponse getResponse(int id) {
		return responses.findById(id);
	}
	
	public boolean isResponseExist(int id) {
		return responses.exist(id);
	}

	//TODO: change return type. 
	public Object  getOutgongResponseIDs(int user_id, int requestID,
			ResponseStatus status, String sorting, List<Integer> viewedList,
			List<Integer> unviewedList) {
		if(!users.exist(user_id) || !requests.exist(requestID)) {
			return null;
		}

		List<ATWResponse> list = responses.findResponsesByUserIdAndRequestId(user_id, requestID);
		for(Iterator<ATWResponse> it = list.iterator(); it.hasNext();) {
			ATWResponse r = it.next();
			if(ResponseStatus.forValue(r.getStatus()) == ResponseStatus.UNVIEWED && (status == ResponseStatus.ALL || status == ResponseStatus.UNVIEWED)) {
				unviewedList.add(r.getId());
			}
			if(ResponseStatus.forValue(r.getStatus()) == ResponseStatus.VIEWED && (status == ResponseStatus.ALL || status == ResponseStatus.VIEWED)) {
				viewedList.add(r.getId());
			}
		}
		return list; 
	}
	
	//TODO: change return type. 
	public Object  getIncomingResponseIDs(int user_id, int requestID,
			ResponseStatus status, String sorting, List<Integer> viewedList,
			List<Integer> unviewedList) {
		System.out.println("User "+user_id+ "     and request "+requestID);
		if (!requests.exist(requestID, user_id)) {
			return null;
		}
		System.out.println("Exist!!");		
		List<ATWResponse> list = responses.findResponsesByRequestId(requestID);
		System.out.println("List "+list);
		for(Iterator<ATWResponse> it = list.iterator(); it.hasNext();) {
			ATWResponse r = it.next();
			if(ResponseStatus.forValue(r.getStatus()) == ResponseStatus.UNVIEWED && unviewedList != null) {
				unviewedList.add(r.getId());
			}
			if(ResponseStatus.forValue(r.getStatus()) == ResponseStatus.VIEWED && viewedList != null) {
				viewedList.add(r.getId());
			}
		}
		return list;
	}
	public ATWResponse deleteResponse(int id) {
		return responses.deleteById(id);
	}

	public ATWResponse deleteIncomingResponse(int user_id, int responseID) {
		ATWResponse response = responses.findById(responseID);
		if (!requests.exist(response.getRequest_id(), user_id)) {
			return null;
		}
		return responses.markDeleted(response, true);
	}

	public List<ATWResponse> getResponses() {
		return responses.findAll();
	}
	public List<ATWResponse> getResponses(int user_id) {
		return responses.findByUserId(user_id);
	}
	public List<ATWEvent> getUpdates(int user_id, Date timeStamp, Date timeRequest) {
		List<ATWEvent> list = new ArrayList<ATWEvent>();
		if (timeRequest.before(timeStamp)) return list;
		ATWUser user = users.findById(user_id);
		requests.updateExpiredRequests(timeRequest);
/*
		OUTGOING_REQUESTS_CHANGED
		The event is produced when a client creates new request (or possibly deletes the existing one)
		The app is expected to call getOutgoingRequestIds() after receiving an event to get an updated list.
		The event may OPTIONALLY carry the updated list of outgoing request ids. This may be needed if the api implementation does not perform caching.
/**/
		List<Integer> outReqChanged = requests.findNewOutgoingRequestsByUserIdAndDate(user_id, timeStamp, timeRequest);
		if (outReqChanged.size() > 0) {
			System.out.println("We have new outgoing requests");
			list.add(ATWEvent.getOutReqChanged());
		} else { System.out.println("No new outgoing requests");}
/*		
		INCOMING_REQUESTS_CHANGED
		The event is produced when a server routes to the client a new request or otherwise turns the previously routed request off
		The app is expected to call getIncomingRequestIds() after receiving an event to get an updated list.
		The event may OPTIONALLY carry the updated list of outgoing request ids. This may be needed if the api implementation does not perform caching.
/**/
		if (user.getLastDelteRequestDate() != null && 
				timeStamp.before(user.getLastDelteRequestDate()) && timeRequest.after(user.getLastDelteRequestDate()) ) {
			list.add(ATWEvent.getIncReqChanged());
		} else {
			for (Iterator<ATWRequest> it  = user.getIncomingRequests().iterator(); it.hasNext();) {
				ATWRequest req = it.next();
				Date creationT = req.getTime();
				Date expireT = req.getExpireTime();
				if( (creationT.after(timeStamp) && creationT.before(timeRequest)) ||
						//?? shod we do that?
						(expireT.after(timeStamp) && expireT.before(timeRequest))) {
					list.add(ATWEvent.getIncReqChanged());
					System.out.println("We have new incomming requests");
					break;
				}
				if(!it.hasNext()) { System.out.println("No new Incomming requests");}
			}
		}
		
/*
		REQUEST_CHANGED
		The event object also carries requestId of the changed request. Any change in the request properties causes this event to be distributed to all the involved parties. 
		The app is expected to call getRequest() after receiving an event to get the the updated request.
		The event may OPTIONALLY carry the updated request. This may be needed if the api implementation does not perform caching.
/**/
		outReqChanged = requests.findModifiedOutgoingRequestsByUserIdAndDate(user_id, timeStamp, timeRequest);		
		for(Iterator<Integer> it = outReqChanged.iterator();it.hasNext();) {
			list.add(ATWEvent.getReqChanged(it.next()));
		}
		if (outReqChanged.size() > 0) { System.out.println("We have changed  outgoing requests"); }
		else { System.out.println("No changed outgoing requests");}
		
		for (Iterator<ATWRequest> it  = user.getIncomingRequests().iterator(); it.hasNext();) {
			ATWRequest req = it.next();
			Date t = req.getModificationDate();
			if( t.after(timeStamp) && t.before(timeRequest)) {
				list.add(ATWEvent.getReqChanged(req.getId()));
				System.out.println("We have changed incomming request");
			}
		}

/*
		OUTGOING_RESPONSES_CHANGED
		The event is produced when a client creates new response to an existing request (or possibly deletes the existing one).
		The event carries requestId the list of responses is changed for.
		The app is expected to call getOutgoingResponseIds() after receiving an event to get an updated list.
		The event may OPTIONALLY carry the updated list of outgoing response ids. This may be needed if the api implementation does not perform caching.
/**/
		List<Integer> outRespChanged = responses.findNewOrStatusChangedOutgoingResponsesByUserIdAndDate(user_id, timeStamp, timeRequest);
		System.out.println(" Outgoing requests: "+outRespChanged);
		for(Iterator<Integer> it = outRespChanged.iterator();it.hasNext();) {
			list.add(ATWEvent.getOutRespChanged(it.next()));
		}

		if (outRespChanged.size() > 0) { System.out.println("We have new outgoing responses"); } 
		else { System.out.println("No new outgoing responses"); }	
/*
		INCOMING_RESPONSES_CHANGED
		The event is produced when a server routes to the client a new response or otherwise turns the previously routed response off.
		The event carries requestId the list of responses is changed for.
		The app is expected to call getIncomingResponseIds() after receiving an event to get an updated list.
		The event may OPTIONALLY carry the updated list of incoming response ids. This may be needed if the api implementation does not perform caching.
/**/
		List<Integer> outReq = requests.findOutgoingRequestsIDsByUserId(user_id);
		System.out.println("Incomming requests: "+outReq);
		if(outReq.size() > 0) {
			Set<Integer> ids = new HashSet<>(outReq);
			List<Integer> incReqForResponsesChanged = responses.findNewOrStatusChangedResponsesByRequestsIdAndDate(ids, timeStamp, timeRequest);
			for (Iterator<Integer> it = incReqForResponsesChanged.iterator(); it.hasNext();) {
				list.add(ATWEvent.getIncRespChanged(it.next()));
			}
			
			if (incReqForResponsesChanged.size() > 0) { System.out.println("We have new incomming responses");}
			else {System.out.println("No new incomming responses");}
		} else {System.out.println("No new incomming responses (no requests)");}
/*
		RESPONSE_CHANGED
		The event object carries responseId of the changed response and requestId of the request the response is associated with. Any change in the response properties causes this event to be distributed to all the involved parties. 
		The app is expected to call getResponse() after receiving an event to get the the updated request.
		The event may OPTIONALLY carry the updated request. This may be needed if the api implementation does not perform caching.
	*/	
		List<ATWResponse> outRespModified = responses.findModifiedOutgoingRequestsByUserIdAndDate(user_id, timeStamp, timeRequest);
		for(Iterator<ATWResponse> it = outRespModified.iterator();it.hasNext();) {
			ATWResponse resp = it.next();
			list.add(ATWEvent.getRespChanged(resp.getRequest_id(), resp.getId()));
		}

		if (outRespModified.size() > 0) { System.out.println("We have modified outgoing responses"); } 
		else { System.out.println("No modified outgoing responses"); }	
		
		if(outReq.size() > 0) {
			Set<Integer> ids = new HashSet<>(outReq);
			List<ATWResponse> incModifiedResponsesForOutReq = responses.findModifiedResponsesByRequestsIdAndDate(ids, timeStamp, timeRequest);
			for(Iterator<ATWResponse> it = incModifiedResponsesForOutReq.iterator();it.hasNext();) {
				ATWResponse resp = it.next();
				list.add(ATWEvent.getRespChanged(resp.getRequest_id(), resp.getId()));
			}
			if (incModifiedResponsesForOutReq.size() > 0) { System.out.println("We have modified incomming responses");}
			else {System.out.println("No modified incomming responses");}
		} else {System.out.println("No modified incomming responses (no requests)");}
		
		
		return list;
	}
	
}
