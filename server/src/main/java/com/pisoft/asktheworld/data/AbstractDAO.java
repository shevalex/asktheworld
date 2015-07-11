package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractDAO<T extends Serializable> {
	protected Class<T> tClass;
	//private String countByID = "select count(obj) from "+tClass.getName()+" obj where obj.id=?1";
	 
	@PersistenceContext
	protected EntityManager entityManager;
	 
	public final void setTClass(final Class<T> tClass) {
		this.tClass = tClass;
	}
	
	public T findById(final int id) {
	  return entityManager.find(tClass, id);
	}

	@SuppressWarnings("unchecked")
	public List<T> findAll() {
		//class name == Table name
		return entityManager.createQuery("select u from " + tClass.getName() + " u").getResultList();
	}
	
	public void create(final T entity) {
		entityManager.persist(entity);
		entityManager.flush();
	}

	public T update(final T entity) {
		return entityManager.merge(entity);
	}
	
	public void delete(final T entity) {
		entityManager.remove(entity);
	}
	
	public T deleteById(final int entityId) {
		final T entity = findById(entityId);
		delete(entity);
		return entity;
		
	}
	
	public boolean exist(int id) {
		long count = (long) entityManager.createQuery("select count(obj) from "+tClass.getName()+" obj where obj.id=?1")
				.setParameter(1, id)
				.getSingleResult();
		System.out.println("Count of items with id "+ count);
		return count >0;
	}
	
}
