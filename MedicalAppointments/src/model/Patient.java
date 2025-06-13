package src.model;

public class Patient {
    private final String name;
    private final String id;

    public Patient(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }
}