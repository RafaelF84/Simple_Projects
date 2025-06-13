package src.gui;

import src.service.AppointmentSystem;

import javax.swing.*;
import java.awt.*;

public class DoctorRegistrationPanel extends JPanel {
    private final JTextField nameField;
    private final JTextField licenseField;
    private final AppointmentPanel appointmentPanel;

    public DoctorRegistrationPanel(AppointmentSystem system, AppointmentPanel appointmentPanel) {
        this.appointmentPanel = appointmentPanel;
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JLabel nameLabel = new JLabel("Doctor Name:");
        gbc.gridx = 0; gbc.gridy = 0;
        add(nameLabel, gbc);

        nameField = new JTextField(20);
        gbc.gridx = 1; gbc.gridy = 0;
        add(nameField, gbc);

        JLabel licenseLabel = new JLabel("License Number:");
        gbc.gridx = 0; gbc.gridy = 1;
        add(licenseLabel, gbc);

        licenseField = new JTextField(20);
        gbc.gridx = 1; gbc.gridy = 1;
        add(licenseField, gbc);

        JButton registerButton = new JButton("Register Doctor");
        gbc.gridx = 0; gbc.gridy = 2;
        gbc.gridwidth = 2;
        add(registerButton, gbc);

        registerButton.addActionListener(e -> {
            String name = nameField.getText().trim();
            String license = licenseField.getText().trim();

            if (name.isEmpty() || license.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Please fill all fields.", "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                system.registerDoctor(name, license);
                JOptionPane.showMessageDialog(this, "Doctor registered successfully!");
                nameField.setText("");
                licenseField.setText("");
                appointmentPanel.reloadComboBoxes();
            }
        });
    }
}