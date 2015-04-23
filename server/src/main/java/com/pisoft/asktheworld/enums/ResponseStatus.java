public enum ResponseStatus {
    VIEWED("viewed"),
    UNVIEWED("unviewed"),
    ALL("all");
    private final String status;

    private ResponseStatus(String status) {
        this.status = status;
    }
    
}