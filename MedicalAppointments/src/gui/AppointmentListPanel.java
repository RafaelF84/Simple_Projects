package src.gui;

import src.model.Appointment;
import src.service.AppointmentSystem;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class AppointmentListPanel extends JPanel {
    private final JTable table;
    private final DefaultTableModel tableModel;
    private final AppointmentSystem system;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public AppointmentListPanel(AppointmentSystem system) {
        this.system = system;
        setLayout(new BorderLayout());

        String[] columns = {"Patient", "Doctor", "Date & Time"};
        tableModel = new DefaultTableModel(columns, 0);
        table = new JTable(tableModel);
        table.setEnabled(false);

        JScrollPane scrollPane = new JScrollPane(table);
        add(scrollPane, BorderLayout.CENTER);

        JButton refreshButton = new JButton("Refresh List");
        refreshButton.addActionListener(e -> loadAppointments());
        add(refreshButton, BorderLayout.SOUTH);

        loadAppointments();
    }

    private void loadAppointments() {
        tableModel.setRowCount(0);

        List<Appointment> appointments = system.getAppointments();
        for (Appointment appt : appointments) {
            Object[] row = {
                appt.getPatient().toString(),
                appt.getDoctor().toString(),
                appt.getDateTime().format(formatter)
            };
            tableModel.addRow(row);
        }
    }
}
