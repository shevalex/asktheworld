package com.pisoft.asktheworld.enums;
public enum Gender {
    MALE("male"),
    FAMALE("famale"),
    ALL("all");
    private final String gender;

    private Gender(String gender) {
        this.gender = gender;
    }
    
}