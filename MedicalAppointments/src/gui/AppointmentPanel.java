package src.gui;

import src.model.Doctor;
import src.model.Patient;
import src.service.AppointmentSystem;

import javax.swing.*;
import java.awt.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class AppointmentPanel extends JPanel {
    private final JComboBox<String> patientComboBox;
    private final JComboBox<String> doctorComboBox;
    private final JTextField dateTimeField;
    private final AppointmentSystem system;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public AppointmentPanel(AppointmentSystem system) {
        this.system = system;
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 8, 8, 8);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        gbc.gridx = 0; gbc.gridy = 0;
        add(new JLabel("Select Patient:"), gbc);

        patientComboBox = new JComboBox<>();
        gbc.gridx = 1; gbc.gridy = 0;
        add(patientComboBox, gbc);

        gbc.gridx = 0; gbc.gridy = 1;
        add(new JLabel("Select Doctor:"), gbc);

        doctorComboBox = new JComboBox<>();
        gbc.gridx = 1; gbc.gridy = 1;
        add(doctorComboBox, gbc);

        gbc.gridx = 0; gbc.gridy = 2;
        add(new JLabel("Date & Time (yyyy-MM-dd HH:mm):"), gbc);

        dateTimeField = new JTextField(20);
        gbc.gridx = 1; gbc.gridy = 2;
        add(dateTimeField, gbc);

        JButton scheduleButton = new JButton("Schedule Appointment");
        gbc.gridx = 0; gbc.gridy = 3;
        gbc.gridwidth = 2;
        add(scheduleButton, gbc);

        loadPatients();
        loadDoctors();

        scheduleButton.addActionListener(e -> scheduleAppointment());
    }

    private void loadPatients() {
        patientComboBox.removeAllItems();
        List<Patient> patients = system.getPatients();
        if (patients.isEmpty()) {
            patientComboBox.addItem("No patients registered");
            patientComboBox.setEnabled(false);
        } else {
            patientComboBox.setEnabled(true);
            for (Patient p : patients) {
                patientComboBox.addItem(p.getName() + " (ID: " + p.getId() + ")");
            }
        }
    }

    private void loadDoctors() {
        doctorComboBox.removeAllItems();
        List<Doctor> doctors = system.getDoctors();
        if (doctors.isEmpty()) {
            doctorComboBox.addItem("No doctors registered");
            doctorComboBox.setEnabled(false);
        } else {
            doctorComboBox.setEnabled(true);
            for (Doctor d : doctors) {
                doctorComboBox.addItem(d.getName() + " (License: " + d.getLicenseNumber() + ")");
            }
        }
    }

    private void scheduleAppointment() {
        if (!patientComboBox.isEnabled() || !doctorComboBox.isEnabled()) {
            JOptionPane.showMessageDialog(this, "Please register patients and doctors first.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        int patientIndex = patientComboBox.getSelectedIndex();
        int doctorIndex = doctorComboBox.getSelectedIndex();
        String dateTimeText = dateTimeField.getText().trim();

        if (dateTimeText.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter date and time.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try {
            LocalDateTime dateTime = LocalDateTime.parse(dateTimeText, formatter);
            Patient selectedPatient = system.getPatients().get(patientIndex);
            Doctor selectedDoctor = system.getDoctors().get(doctorIndex);

            boolean success = system.scheduleAppointment(selectedPatient, selectedDoctor, dateTime);
            if (success) {
                JOptionPane.showMessageDialog(this, "Appointment scheduled successfully!");
                dateTimeField.setText("");
            } else {
                JOptionPane.showMessageDialog(this, "The doctor already has an appointment at this time.", "Conflict", JOptionPane.WARNING_MESSAGE);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Invalid date/time format. Use yyyy-MM-dd HH:mm", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}