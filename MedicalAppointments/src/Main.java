package src;

import src.gui.MainWindow;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        try {
            // FlatLaf (add FlatLaf to your project dependencies)
            UIManager.setLookAndFeel("com.formdev.flatlaf.intellijthemes.FlatArcDarkIJTheme");
        } catch (Exception e) {
            try {
                // Fallback to Nimbus
                UIManager.setLookAndFeel("javax.swing.plaf.nimbus.NimbusLookAndFeel");
            } catch (Exception ex) {
                // fallback to default
            }
        }

        SwingUtilities.invokeLater(() -> {
            MainWindow window = new MainWindow();
            window.setVisible(true);
        });
    }
}