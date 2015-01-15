package com.pisoft.asktheworld.data;


import java.util.List;

import org.springframework.stereotype.Repository;

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
/*	
	public ATWUser findById(final int id) {
		  return entityManager.find(tClass, id);
		}

		@SuppressWarnings("unchecked")
		public List<ATWUser> findAll() {
			//class name == Table name
			return entityManager.createQuery("select u from " + tClass.getName() + " u").getResultList();
		}
		
		public void create(final ATWUser entity) {
			//Thread.dumpStack();
			entityManager.persist(entity);
			entityManager.flush();
		}

		public ATWUser update(final ATWUser entity) {
			return entityManager.merge(entity);
		}
		
		public void delete(final ATWUser entity) {
			entityManager.remove(entity);
		}
		
		public void deleteById(final int entityId) {
			final ATWUser entity = findById(entityId);
			delete(entity);
		}
*/
}
