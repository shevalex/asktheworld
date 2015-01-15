package com.pisoft.asktheworld.data;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public interface UserDAO {
	public ATWUser findById(final int id);
	public List<ATWUser> findAll();
	public void create(final ATWUser entity);
	public ATWUser update(final ATWUser entity);
	public void delete(final ATWUser entity);
	public void deleteById(final int entityId);
	public ATWUser findByLogin(String login);
}
