package com.pisoft.asktheworld.enums;
public enum Sorting {
    CHRONOLOGICALLY("chronologically"),
    DEFAULT("");
    private final String sorting;

    private Sorting(String sorting) {
        this.sorting = sorting;
    }
    public boolean equals(String s) {
        return s == this.sorting;
    }

}