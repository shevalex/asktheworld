package com.pisoft.asktheworld.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gender {
    MALE("male"),
    FAMALE("famale"),
    ALL("all");
    private final String gender;

    private Gender(String gender) {
        this.gender = gender;
    }

    public boolean equals(String s) {
        return s == this.gender;
    }

	@Override
	@JsonValue
	public String toString() {
		return gender;
	}
	
	@JsonCreator
	public static Gender forValue(String gender) { 
		//TODO: can we do this more smart? 
		if (MALE.equals(gender)) return MALE;
		if (FAMALE.equals(gender)) return FAMALE;
		return null;
	}
}