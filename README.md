# Simple Calculator

This is a basic calculator project built with HTML and JavaScript.  
It allows users to perform simple arithmetic operations like addition, subtraction, multiplication, and division.

## 🖥 Preview

The calculator features:
- Number buttons (0–9)
- Decimal point
- Operators (+, −, ×, ÷)
- Clear button (C)
- Equal button (=)
- Real-time display of the current expression and result

## 🚀 How to Run

1. Clone the repository or download the project folder.
2. Open the `index.html` file in your browser.
3. Use the calculator interface to perform operations.

No installation or setup required.

## 📁 Files

- `index.html` — main structure and layout
- `script.js` — calculator logic and interactivity

---

# Chess Game

This is a two-player chess game built with HTML, CSS, and JavaScript.  
It supports all official chess rules and provides an interactive UI to play locally.

## 🖥 Preview

Features include:
- Valid moves for all pieces (pawn, rook, knight, bishop, queen, king)
- Special moves: castling, en passant, and automatic pawn promotion to queen
- Check and checkmate detection
- Visual indicators of possible moves (highlighted with circles)
- Drag-and-drop or click-based piece movement

## 🚀 How to Run

1. Clone the repository or download the chess project folder.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same folder.
3. Open the `index.html` file in your browser to start playing.

No installation or setup required.

## 📁 Files

- `index.html` — chess board and layout
- `style.css` — styling for the board and pieces
- `script.js` — chess game logic and interactivity

# Medical Appointments

A simple desktop application for managing medical appointments, built with Java Swing.

## Features

- **Register Patients:** Add new patients with name and ID.
- **Register Doctors:** Add new doctors with name and license number.
- **Schedule Appointments:** Select a patient, doctor, and date/time to schedule an appointment. Prevents double-booking for doctors.
- **View Appointments:** See all scheduled appointments in a table.
- **Modern UI:** Uses [FlatLaf](https://www.formdev.com/flatlaf/) for a modern look and feel (with fallback to Nimbus).
- **Tabbed Interface:** Easy navigation between registration, scheduling, and viewing.

## How to Run

1. **Clone or download** this repository.
2. **Add FlatLaf to your project dependencies.**
   - Download from [FlatLaf releases](https://github.com/JFormDesigner/FlatLaf/releases) or add via Maven/Gradle.
   - Place the FlatLaf JAR (and optionally FlatLaf IntelliJ Themes JAR) in your classpath.
3. **Compile the project:**
   ```sh
   javac -cp ".;path/to/flatlaf.jar;path/to/flatlaf-intellij-themes.jar" src/**/*.java
   ```
4. **Run the application:**
   ```sh
   java -cp ".;path/to/flatlaf.jar;path/to/flatlaf-intellij-themes.jar;src" src.Main
   ```

## Project Structure

```
src/
  Main.java
  gui/
    MainWindow.java
    PatientRegistrationPanel.java
    DoctorRegistrationPanel.java
    AppointmentPanel.java
    AppointmentListPanel.java
  model/
    Patient.java
    Doctor.java
    Appointment.java
  service/
    AppointmentSystem.java
```


## Dependencies

- Java 8 or higher
- [FlatLaf](https://www.formdev.com/flatlaf/) (for modern UI)
- (Optional) FlatLaf IntelliJ Themes for extra themes

## Customization

- **Icons:** Place your PNG icons in `resources/icons/` and update the paths in `MainWindow.java`.
- **Themes:** Change the FlatLaf theme in `Main.java` for a different look (e.g., FlatLightLaf, FlatDarkLaf, FlatArcDarkIJTheme, etc).

## Limitations

- Data is stored in memory only (no database or file persistence).
- Appointment conflict checking only prevents exact date/time overlaps for doctors.
- No search/filter in the appointments list (can be added as an enhancement).

**Feel free to fork and improve this project!**