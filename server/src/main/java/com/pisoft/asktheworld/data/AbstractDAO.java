package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractDAO<T extends Serializable> {
	 
	protected Class<T> tClass;
	 
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
	
	public void deleteById(final int entityId) {
		final T entity = findById(entityId);
		delete(entity);
	}
	
}