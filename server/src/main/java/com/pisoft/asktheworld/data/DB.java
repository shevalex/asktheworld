package com.pisoft.asktheworld.data;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class DB {
	public boolean verifyString(String str) {return str != null && str.length() > 3;}
	public boolean verifyYear(int year) { return year > 1900 && year < 2100;}
	public boolean verifyLangs(String langs[]) { return langs != null && langs.length > 0;}
	public boolean verifyAge(String str) {return true;}
	static DB db = new DB();
	int lastId = 0;
	Map<String, Integer> names = new HashMap<String, Integer>();
	Map<Integer,User> users = new HashMap<Integer,User>();
	
	private DB(){}
	
	public static DB getInstance(){ return db;}
	
	public User getUser(int id) {
		return users.get(new Integer(id));
	}
	
	public User findUser(String login) {
		Integer id = names.get(login);
		return id == null?null:getUser(id);
	}
	
	public User addUser(User user) {
		if (findUser(user.getLogin()) == null) {
			user.setId(lastId++);
			Integer id = new Integer(user.getId());
			names.put(user.getLogin(), id);
			users.put(id,  user);
			return user;
		}
		return null;
	}
	
	public User deleteUser(int id) {
		User user = getUser(id);
		if( user != null) {
			names.remove(user.getLogin());
			users.remove(new Integer(id));
		}
		return user;
		
	}
	
	public User updateUser(User user){
		User existUser = getUser(user.getId());
		if( existUser != null) {
			if(verifyString(user.getPassword())) existUser.setPassword(user.getPassword());
			if(verifyString(user.getGender())) existUser.setGender(user.getGender());
			if(verifyAge(user.getAge_category())) existUser.setAge_category(user.getAge_category());
			if(verifyLangs(user.getLanguages())) existUser.setLanguages(user.getLanguages());
		}
		return existUser;
	}
	
	public int[] getIDs(){
		int ids[] = new int[users.size()];
		int i = 0;
		for(Iterator<Integer> it = users.keySet().iterator(); it.hasNext(); ids[i++] = it.next());
		return ids;
	}
}
