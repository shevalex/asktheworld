package com.pisoft.asktheworld.configurations;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

import javax.sql.DataSource;
import javax.persistence.EntityManagerFactory;

import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EnableTransactionManagement(mode=AdviceMode.PROXY)
@ComponentScan({ "com.pisoft.asktheworld.data" })
public class JPAConfiguration {

	public JPAConfiguration(){
		super();
	}
	
    // beans
    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
    	final LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
    	em.setDataSource(dataSource());
    	em.setPackagesToScan(new String[] { "com.pisoft.asktheworld.data" });
    	final HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
    	em.setJpaVendorAdapter(vendorAdapter);
    	em.setJpaProperties(additionalProperties());
    	
    	return em;
    }

    @Bean
    public DataSource dataSource() {
    	final DriverManagerDataSource dataSource = new DriverManagerDataSource();
    	dataSource.setDriverClassName("org.postgresql.Driver");
    	URI dbUri = null;
		try {
			dbUri = new URI(System.getenv("DATABASE_URL"));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}

    	String username = dbUri.getUserInfo().split(":")[0];
    	String password = dbUri.getUserInfo().split(":")[1];
    	String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + dbUri.getPath()+"?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory";

    	dataSource.setUrl(dbUrl);
    	dataSource.setUsername(username);
    	dataSource.setPassword(password);
    	return dataSource;
    }
    
    @Bean
    public PlatformTransactionManager transactionManager(final EntityManagerFactory emf) {
    	final JpaTransactionManager transactionManager = new JpaTransactionManager();
    	transactionManager.setEntityManagerFactory(emf);
    	return transactionManager;
    }
    
    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
    	return new PersistenceExceptionTranslationPostProcessor();
    }
    
    final Properties additionalProperties() {
    	final Properties hibernateProperties = new Properties();
    	hibernateProperties.setProperty("hibernate.hbm2ddl.auto", "update");
    	//hibernateProperties.setProperty("hibernate.hbm2ddl.auto", "create");
    	hibernateProperties.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
    	hibernateProperties.setProperty("hibernate.format_sql", "true");
    	hibernateProperties.setProperty("hibernate.show_sql", "true");
    	hibernateProperties.setProperty("hibernate.temp.use_jdbc_metadata_defaults", "false");
    	
    	//hibernateProperties.setProperty("hibernate.globally_quoted_identifiers", "true");
    	return hibernateProperties;
    }

}
