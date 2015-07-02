package com.pisoft.asktheworld.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ConstraintMode;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.UniqueConstraint;
import javax.validation.Constraint;

import org.hibernate.annotations.Cascade;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pisoft.asktheworld.enums.Gender;

@Entity
public class ATWUser implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 927995499391295373L;
 
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column
	@JsonIgnore	
	private int id;
	
	@Column
	private String login;
	@Column
	private String password;
	@Column
	private String languages[];
	@Column(columnDefinition="int4 default 2 not null") //TODO: need to add default value 
	private Gender gender = Gender.OTHER; //TODO: default value is not working
	@Column
	private String name;
	@Column
	private String age_category;

	public Gender getGender() {
		return gender;
	}
	public void setGender(Gender gender) {
		this.gender = gender;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String[] getLanguages() {
		return languages;
	}
	public void setLanguages(String[] languages) {
		this.languages = languages;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	//TODO: Probably we need to change this to request IDs to minimize size of this array
	@JsonIgnore
	@ManyToMany
	@JoinTable(name="USER_INC_REQ",  
	      joinColumns=@JoinColumn(name="USER_ID", referencedColumnName="id"), inverseForeignKey=@ForeignKey(value=ConstraintMode.NO_CONSTRAINT),
	      inverseJoinColumns = @JoinColumn(name="REQ_ID", referencedColumnName="request_id", foreignKey=@ForeignKey(value=ConstraintMode.NO_CONSTRAINT), columnDefinition="int4 REFERENCES ATWRequest(request_id) ON DELETE CASCADE") ) //TODO: I am not sure that this will work for not postgres  
//TODO: the result of this code is below. We dont need to alter foreign key REQ_ID. It is described in table creation 
/**
Hibernate: 
    create table USER_INC_REQ (
        USER_ID int4 not null,
        REQ_ID int4 REFERENCES ATWRequest(request_id) ON DELETE CASCADE not null
    )
Hibernate: 
    alter table USER_INC_REQ 
        add constraint FK_3blnj2ryhscr9k4fqayn3inx8 
        foreign key (REQ_ID) 
        references ATWRequest
Hibernate: 
    alter table USER_INC_REQ 
        add constraint FK_tampvlptvfb2r2ikovgk87ybm 
        foreign key (USER_ID) 
        references ATWUser	
 */
	
	private List<ATWRequest> incomingRequets = new ArrayList<ATWRequest>();
	
	
	public ATWUser createCopy() {
		ATWUser user  = new ATWUser();
		user.setId(getId());
		user.setLogin(getLogin());
		user.setGender(getGender());
		user.setAge_category(getAge_category());
		user.setLanguages(getLanguages());
		user.setName(getName());
		return user;
	}
	public String getAge_category() {
		return age_category;
	}
	public void setAge_category(String age_category) {
		this.age_category = age_category;
	}
	
	@Override
	public boolean equals(Object obj) {
		 if (this == obj) return true;
		 if (obj == null) return false;
	     if (getClass() != obj.getClass()) return false;
	     final ATWUser other = (ATWUser) obj;
	     if (login != null && login.equals(other.getLogin()))  return true;
	     return false;
	}
	public void addRequets(ATWRequest request) {
		incomingRequets.add(request);
	}

	public ATWRequest deleteRequest(ATWRequest request) {
		return incomingRequets.remove(request)?request:null;
	}
	
	public List<Integer> getIncomingRequestsIDs(){
		List<Integer> reqstsIds = new ArrayList<Integer>();
		for(Iterator<ATWRequest> it =incomingRequets.iterator(); it.hasNext(); reqstsIds.add(it.next().getId()));
		return reqstsIds;
	}
	
	public List<ATWRequest> getIncomingRequests() {
		return incomingRequets;
	}
	
	
}