package com.pisoft.asktheworld.data;

import java.util.ArrayList;
import java.util.List;

public class ATWSettings {
	static public ATWSettings obj = new ATWSettings(); 
	List<ATWCategory> expertise_categories = null;
	
	public ATWSettings() {
		expertise_categories = new ArrayList<ATWCategory>();
		expertise_categories.add(new ATWCategory("general","General","gray","black"));
		expertise_categories.add(new ATWCategory("law", "Law", "green", "black"));
		expertise_categories.add(new ATWCategory("medicine", "Medical", "red", "black"));
		expertise_categories.add(new ATWCategory("construction", "Construction", "blue", "black"));
	}

	public List<ATWCategory> getExpertise_categories() {
		return expertise_categories;
	}
	
	
}

class ATWCategory {
	String data;
	String display;
	String bg;
	String fg;
	public ATWCategory(String data, String display, String bg, String fg) {
		super();
		this.data = data;
		this.display = display;
		this.bg = bg;
		this.fg = fg;
	}
	public String getData() {
		return data;
	}
	public String getDisplay() {
		return display;
	}
	public String getBg() {
		return bg;
	}
	public String getFg() {
		return fg;
	}
	
   
}