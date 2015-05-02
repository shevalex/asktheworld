package com.pisoft.asktheworld.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AgeCategory {
    TEENS("teens"),
    ADULTS("adults"),
    SENIORS("senior"),
    ALL("all");
    private final String age;

    private AgeCategory(String age) {
        this.age = age;
    }

    public boolean equals(String s) {
        return s == this.age;
    }
    
	@Override
	@JsonValue
	public String toString() {
		return age;
	}
	
	@JsonCreator
	public static AgeCategory forValue(String age) { 
		//TODO: can we do this more smart? 
		if (TEENS.equals(age)) return TEENS;
		if (ADULTS.equals(age)) return ADULTS;
		if (SENIORS.equals(age)) return SENIORS;
		return null;
	}

    
}