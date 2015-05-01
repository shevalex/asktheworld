package com.pisoft.asktheworld.enums;

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
    
}