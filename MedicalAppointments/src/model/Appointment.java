package src.model;

import java.time.LocalDateTime;

public class Appointment {
    private final Patient patient;
    private final Doctor doctor;
    private final LocalDateTime dateTime;

    public Appointment(Patient patient, Doctor doctor, LocalDateTime dateTime) {
        this.patient = patient;
        this.doctor = doctor;
        this.dateTime = dateTime;
    }

    public Patient getPatient() {
        return patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }
}