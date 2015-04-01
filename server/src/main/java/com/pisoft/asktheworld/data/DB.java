package com.pisoft.asktheworld.data;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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
	
	public DB() {
		System.out.println("DB CREATED");
	}
	
	@Autowired
	private UserDAOImpl users;
	@Autowired
	private UserSettingsDAOImpl settings;
	@Autowired
	private RequestDAOImpl requests;
	
	
	
	public ATWUser getUser(int id) {
		return users.findById(id);
	}
	
	public ATWUser findUser(String login) {
		ATWUser u = users.findByLogin(login);
		return u;
	}
	
	public ATWUser addUser(ATWUser user) {
		if (findUser(user.getLogin()) == null) {
			users.create(user);
			ATWUserSettings userSettings = new ATWUserSettings();
			userSettings.setId(user.getId());
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
		ATWUser existUser = getUser(user.getId());
		if( existUser != null) {
			if(verifyString(user.getPassword())) existUser.setPassword(user.getPassword());
			if(verifyString(user.getGender())) existUser.setGender(user.getGender());
			if(verifyAge(user.getAge_category())) existUser.setAge_category(user.getAge_category());
			if(verifyLangs(user.getLanguages())) existUser.setLanguages(user.getLanguages());
			users.update(existUser);
		}
		return existUser;
	}
	
	
	public int[] getIDs(){
		List<ATWUser> allUsers = users.findAll();
		int ids[] = new int[allUsers.size()];
		int i = 0;
		for(Iterator<ATWUser> it = allUsers.iterator(); it.hasNext(); ids[i++] = it.next().getId());
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
		return request;
	}

	public ATWRequest getRequest(int id) {
		return requests.findById(id);
	}
	
	public ATWRequest deleteRequest(int id){
		ATWRequest request = getRequest(id);
		if(request != null) {
			requests.deleteById(id);
		}
		return request;
	}
	public ATWRequest updateRequest(ATWRequest request) {
		ATWRequest existRequest = getRequest(request.getId());
		if(existRequest != null) {
			existRequest = requests.update(request);
		}
		return existRequest;
	}
	
	public List<ATWRequest> findUserOutgoingRequests(int id, String status, String sorting) {
		//test it here not necessary but leave it for protection now
		ATWUser existUser = getUser(id);
		List<ATWRequest> list = null;
		if(existUser != null) {
			if (status != null) {
				list = requests.findOutgoingRequestsByUserId(id, status, sorting);
			} else {
				list = requests.findOutgoingRequestsByUserId(id, sorting);
			}
		}
		return list;
	}
	
	public List<Integer> getUserOutgoingRequestsIDs(int id, String status, String sorting) {
		List<Integer> listIDs = null;
		List<ATWRequest> listRequests = findUserOutgoingRequests(id, status, sorting);
		if(listRequests != null) {
			listIDs = new ArrayList<Integer>();
			for(Iterator<ATWRequest> it = listRequests.iterator(); it.hasNext(); listIDs.add(it.next().getId()));
		}
		return listIDs;
	}
	
	public List<Integer> getUserIncommingRequestsIDs(int id, String status,
			String sorting) {
		ATWUser user = getUser(id);
		//get already assigned requests
		List<Integer> userIncommingRequests = getIncommingRequestsByUser(id);
		//get number of requests per day
		List<Integer> userNewIncommingRequests = getNewIncommingRequests(user);
		for(Iterator<Integer> it = userNewIncommingRequests.iterator(); it.hasNext(); ){
			int rID = it.next();
			user.addRequets(getRequest(rID));
			userIncommingRequests.add(rID);
		}
		
		updateUser(user);
		return userIncommingRequests;
	}
	
	//I am not sure that we need this function
	//public void addRequestToUser(int userId, int requestId){}
	public List<Integer> getIncommingRequestsByUser(int userId){
		return getUser(userId).getIncommingRequests();
	}
	
	public List<Integer> getNewIncommingRequests(ATWUser user){
		int id = user.getId();
		List<Integer> userIncommingRequests = getIncommingRequestsByUser(id);
		//List should not be empty
		userIncommingRequests.add(0);
		List<String> userAges = new ArrayList<String>(); 
		userAges.add(user.getAge_category());
		userAges.add("All");
		List<String> userGenders = new ArrayList<String>();
		userGenders.add(user.getGender());
		userGenders.add("All");
		List<ATWRequest> newIncommingRequests = requests.findNewIncommingRequets(id, userIncommingRequests, userAges, userGenders);
		List<Integer> listIDs = null;
		if(newIncommingRequests != null) {
			listIDs = new ArrayList<Integer>();
			for(Iterator<ATWRequest> it = newIncommingRequests.iterator(); it.hasNext(); listIDs.add(it.next().getId()));
		} else {
			System.out.println("LIST EMPTY");
		}
		return listIDs;
	}
	
	

}
