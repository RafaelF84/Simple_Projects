package src.gui;

import src.service.AppointmentSystem;

import javax.swing.*;
import java.awt.*;

public class PatientRegistrationPanel extends JPanel {
    private final JTextField nameField;
    private final JTextField idField;

    public PatientRegistrationPanel(AppointmentSystem system) {
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        setBorder(BorderFactory.createTitledBorder("Patient Registration"));

        JLabel nameLabel = new JLabel("Patient Name:");
        gbc.gridx = 0; gbc.gridy = 0;
        add(nameLabel, gbc);

        nameField = new JTextField(20);
        gbc.gridx = 1; gbc.gridy = 0;
        add(nameField, gbc);

        JLabel idLabel = new JLabel("Patient ID:");
        gbc.gridx = 0; gbc.gridy = 1;
        add(idLabel, gbc);

        idField = new JTextField(20);
        gbc.gridx = 1; gbc.gridy = 1;
        add(idField, gbc);

        JButton registerButton = new JButton("Register Patient");
        gbc.gridx = 0; gbc.gridy = 2;
        gbc.gridwidth = 2;
        add(registerButton, gbc);

        registerButton.addActionListener(e -> {
            String name = nameField.getText().trim();
            String id = idField.getText().trim();

            if (name.isEmpty() || id.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Please fill all fields.", "Error", JOptionPane.ERROR_MESSAGE);
            } else {
                system.registerPatient(name, id);
                JOptionPane.showMessageDialog(this, "Patient registered successfully!");
                nameField.setText("");
                idField.setText("");
            }
        });
    }
}