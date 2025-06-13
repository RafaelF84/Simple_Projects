package src.model;

public class Doctor {
    private final String name;
    private final String licenseNumber;

    public Doctor(String name, String licenseNumber) {
        this.name = name;
        this.licenseNumber = licenseNumber;
    }

    public String getName() {
        return name;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }
}