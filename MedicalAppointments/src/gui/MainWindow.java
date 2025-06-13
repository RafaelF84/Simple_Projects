package src.gui;

import src.service.AppointmentSystem;

import javax.swing.*;
import java.awt.*;

public class MainWindow extends JFrame {
    private final AppointmentSystem system;

    public MainWindow() {
        system = new AppointmentSystem();

        setTitle("Medical Appointment System");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(600, 400);
        setLocationRelativeTo(null);

        JTabbedPane tabs = new JTabbedPane();

        tabs.addTab("Register Patient", new PatientRegistrationPanel(system));
        tabs.addTab("Register Doctor", new DoctorRegistrationPanel(system));
        tabs.addTab("Schedule Appointment", new AppointmentPanel(system));
        tabs.addTab("Appointments List", new AppointmentListPanel(system));

        add(tabs, BorderLayout.CENTER);
    }
}