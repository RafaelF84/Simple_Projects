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
    private final JComboBox<Patient> patientComboBox;
    private final JComboBox<Doctor> doctorComboBox;
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

        reloadComboBoxes();

        scheduleButton.addActionListener(e -> scheduleAppointment());
    }

    public void reloadComboBoxes() {
        patientComboBox.removeAllItems();
        List<Patient> patients = system.getPatients();
        if (patients.isEmpty()) {
            patientComboBox.setEnabled(false);
        } else {
            patientComboBox.setEnabled(true);
            for (Patient p : patients) {
                patientComboBox.addItem(p);
            }
        }

        doctorComboBox.removeAllItems();
        List<Doctor> doctors = system.getDoctors();
        if (doctors.isEmpty()) {
            doctorComboBox.setEnabled(false);
        } else {
            doctorComboBox.setEnabled(true);
            for (Doctor d : doctors) {
                doctorComboBox.addItem(d);
            }
        }
    }

    private void scheduleAppointment() {
        if (!patientComboBox.isEnabled() || !doctorComboBox.isEnabled()) {
            JOptionPane.showMessageDialog(this, "Please register patients and doctors first.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        Patient selectedPatient = (Patient) patientComboBox.getSelectedItem();
        Doctor selectedDoctor = (Doctor) doctorComboBox.getSelectedItem();
        String dateTimeText = dateTimeField.getText().trim();

        if (selectedPatient == null || selectedDoctor == null || dateTimeText.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields.", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        try {
            LocalDateTime dateTime = LocalDateTime.parse(dateTimeText, formatter);
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