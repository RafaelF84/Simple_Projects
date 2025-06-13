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
        setMinimumSize(new Dimension(800, 600));
        setPreferredSize(new Dimension(1000, 700));
        setLocationRelativeTo(null);

        JLabel header = new JLabel("Medical Appointment System", SwingConstants.CENTER);
        header.setFont(new Font("Segoe UI", Font.BOLD, 28));
        header.setBorder(new EmptyBorder(20, 0, 20, 0));
        add(header, BorderLayout.NORTH);

        JTabbedPane tabs = new JTabbedPane();

        AppointmentPanel appointmentPanel = new AppointmentPanel(system);

        tabs.addTab("Register Patient", new PatientRegistrationPanel(system, appointmentPanel));
        tabs.addTab("Register Doctor", new DoctorRegistrationPanel(system, appointmentPanel));
        tabs.addTab("Schedule Appointment", appointmentPanel);
        tabs.addTab("Appointments List", new AppointmentListPanel(system));

        add(tabs, BorderLayout.CENTER);

        JButton themeToggle = new JButton("Toggle Theme");
        themeToggle.addActionListener(e -> {
            try {
                if (UIManager.getLookAndFeel().getName().contains("Dark")) {
                    UIManager.setLookAndFeel("com.formdev.flatlaf.FlatLightLaf");
                } else {
                    UIManager.setLookAndFeel("com.formdev.flatlaf.FlatDarkLaf");
                }
                SwingUtilities.updateComponentTreeUI(this);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });
        add(themeToggle, BorderLayout.SOUTH);
    }
}