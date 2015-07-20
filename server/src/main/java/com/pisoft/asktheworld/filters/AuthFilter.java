package com.pisoft.asktheworld.filters;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import com.pisoft.asktheworld.data.DB;

@Component
public class AuthFilter extends GenericFilterBean {

    AuthenticationManager authManager;
    @Autowired
    private DB db;
    Collection<GrantedAuthority> admin;
    Collection<GrantedAuthority> user;
    Collection<GrantedAuthority> realUser;
    @Autowired
    public AuthFilter(AuthenticationManager authManager) {
        this.authManager = authManager;
        admin=new ArrayList<GrantedAuthority>();
        admin.add(new GrantedAuthorityImpl("ROLE_ADMIN"));
        
        user=new ArrayList<GrantedAuthority>();
        user.add(new GrantedAuthorityImpl("ROLE_USER"));

        realUser=new ArrayList<GrantedAuthority>();
        realUser.add(new GrantedAuthorityImpl("ROLE_REAL_USER"));

    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {

    	HttpServletRequest sr = (HttpServletRequest)request;
    	String token = sr.getHeader("token");
        if(token != null) {
            // validate the token
            String cr[] = token.split(":");
            if (cr.length > 1) System.out.println("User "+cr[0] +"  Pass: "+cr[1]);
//TODO: Create authService class to check auth for different resources. 
//something like this
//            public Person authenticatePerson(String username, String password) throws AuthenticationException {
//            List validUsers = this.getHibernateTemplate().findByNamedParam(
//            "select people from Person people "
//            + "where people.username = :username "
//            + "and people.password = :password",
//            new String[] { "username", "password" },
//            new String[] { username, password });
            
            if (cr.length > 1 && db.findUser(cr[0]) != null && db.findUser(cr[0]).getPassword().equals(cr[1])) 
            {
            	//User exist in DB and has uses correct password
            	//TODO: remove this. It is not working properly. Need correct auth procedure 
            	//check url
            	int index = sr.getRequestURL().indexOf("/user");
            	if(index >= 0) {
            	String pattern = sr.getRequestURL().substring(sr.getRequestURL().indexOf("/user"));
            	System.out.println("Path info: " +pattern);
            	UsernamePasswordAuthenticationToken authentication;
            	// build an Authentication object with the user's info
            	if(pattern.startsWith("/user/"+db.findUser(cr[0]).getUser_id())) {
            		System.out.println("Pattern presents");
                    authentication = 
                            new UsernamePasswordAuthenticationToken(cr[0], cr[1], cr[0].equals("Alex") ? admin:realUser );
            	} else {
            		System.out.println("Pattern Is not presents");
                    authentication = 
                            new UsernamePasswordAuthenticationToken(cr[0], cr[1], cr[0].equals("Alex") ? admin:user );
            	}
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails((HttpServletRequest) request));
                // set the authentication into the SecurityContext
                SecurityContextHolder.getContext().setAuthentication( authentication);
            	}
            }
        } else {
        	System.out.println("No token in request");
        }
        // continue thru the filter chain
        chain.doFilter(request, response);
    }
}
