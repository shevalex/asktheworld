package com.pisoft.asktheworld.enums;
public enum ResponseStatus {
    VIEWED("viewed"),
    UNVIEWED("unviewed"),
    ALL("all");
    private final String status;

    private ResponseStatus(String status) {
        this.status = status;
    }
    public boolean equals(String s) {
        return s == this.status;
    }

}