package com.pisoft.asktheworld.data;

public interface UserSettingsDAO {
	public ATWUserSettings findById(final int id);
	public void create(final ATWUserSettings entity);
	public ATWUserSettings update(final ATWUserSettings entity);
	public void deleteById(final int entityId);
}
