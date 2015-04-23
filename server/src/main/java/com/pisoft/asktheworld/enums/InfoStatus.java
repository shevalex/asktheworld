public enum InfoStatus {
    NO("no"),
    CANPROVIDE("can_provide"),
    PROVIDED("provided"),
    ALL("all");
    private final String status;

    private InfoStatus(String status) {
        this.status = status;
    }
    
}