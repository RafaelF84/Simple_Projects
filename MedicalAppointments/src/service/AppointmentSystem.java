package src.service;

import src.model.Appointment;
import src.model.Doctor;
import src.model.Patient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AppointmentSystem {
    private final List<Patient> patients = new ArrayList<>();
    private final List<Doctor> doctors = new ArrayList<>();
    private final List<Appointment> appointments = new ArrayList<>();

    public void registerPatient(String name, String id) {
        patients.add(new Patient(name, id));
    }

    public void registerDoctor(String name, String licenseNumber) {
        doctors.add(new Doctor(name, licenseNumber));
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public List<Doctor> getDoctors() {
        return doctors;
    }

    public List<Appointment> getAppointments() {
        return appointments;
    }

    public boolean scheduleAppointment(Patient patient, Doctor doctor, LocalDateTime dateTime) {
        for (Appointment appt : appointments) {
            if (appt.getDoctor().equals(doctor) && appt.getDateTime().equals(dateTime)) {
                return false;
            }
        }
        appointments.add(new Appointment(patient, doctor, dateTime));
        return true;
    }
}