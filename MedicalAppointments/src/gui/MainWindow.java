package src.gui;

import src.service.AppointmentSystem;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class MainWindow extends JFrame {
    private final AppointmentSystem system;

    public MainWindow() {
        system = new AppointmentSystem();

        setTitle("Medical Appointment System");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(800, 600);
        setLocationRelativeTo(null);

        // Optional: Add a logo or header
        JLabel header = new JLabel("Medical Appointment System", SwingConstants.CENTER);
        header.setFont(new Font("Segoe UI", Font.BOLD, 28));
        header.setBorder(new EmptyBorder(20, 0, 20, 0));
        add(header, BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();

        tabs.addTab("Register Patient", new ImageIcon("resources/icons/patient.png"), new PatientRegistrationPanel(system));
        tabs.addTab("Register Doctor", new ImageIcon("resources/icons/doctor.png"), new DoctorRegistrationPanel(system));
        tabs.addTab("Schedule Appointment", new ImageIcon("resources/icons/calendar.png"), new AppointmentPanel(system));
        tabs.addTab("Appointments List", new ImageIcon("resources/icons/list.png"), new AppointmentListPanel(system));

        add(tabs, BorderLayout.CENTER);
    }
}