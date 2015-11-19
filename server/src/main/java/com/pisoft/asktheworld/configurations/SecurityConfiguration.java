package com.pisoft.asktheworld.configurations;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.pisoft.asktheworld.data.DB;
import com.pisoft.asktheworld.filters.AuthFilter;

class SecureAuthenticationEntryPoint implements AuthenticationEntryPoint {
	@Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        response.sendError( HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Authentication token was either missing or invalid or XEP 3HAET" );
    }
}

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true,prePostEnabled = true) 
@EnableTransactionManagement(mode=AdviceMode.PROXY)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	SecureAuthenticationEntryPoint secureEntryPoint = new SecureAuthenticationEntryPoint();
	@Autowired
    AuthenticationManager authManager;
    @Autowired
    private DB db;
        
    AuthFilter af = null;// = new AuthFilter();
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		af = new AuthFilter(authManager, db);
		http
			.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
		//	.httpBasic()
		//		.realmName("AskTheWorld realm")
		//		.authenticationEntryPoint(secureEntryPoint)
		//		.and()
			.addFilterBefore(af, BasicAuthenticationFilter.class)
			.csrf().disable()
			.anonymous().disable()
			.logout().disable()
			
			
			; //disable on server side
	}
	
	@Override
	public void configure(WebSecurity web) throws Exception {
	    web
	      .ignoring()
	         .antMatchers(HttpMethod.POST, "/user");
	}
	
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		//auth.inMemoryAuthentication().
	    auth.userDetailsService(userDetailsService());
    }
	 
	@Bean
	protected
	UserDetailsService userDetailsService() {
	    return new UserDetailsService() {
	      @Override
	      public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    	  Thread.currentThread().dumpStack();
	        return new User(username, null, true, true, true, true,
	                null);
	      }
	      
	    };
	  }
}


