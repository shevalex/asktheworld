public enum AgeCategory {
    TEENS("teens"),
    ADULTS("adults"),
    SENIORS("senior"),
    ALL("all");
    private final String age;

    private AgeCategory(String age) {
        this.age = age;
    }
    
}