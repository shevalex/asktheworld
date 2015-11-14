package com.pisoft.asktheworld.data;

import org.springframework.stereotype.Repository;

@Repository
public class TokenDAOImpl extends AbstractDAO<ATWToken> {
	public TokenDAOImpl(){
		super();
		setTClass(ATWToken.class);
	}

}
