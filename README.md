# KAPS MedTech 🏥

A comprehensive healthcare management system connecting Students/Staff with University Doctors.

## 🌟 Features

- **Role-Based Access**: Specialized dashboards for Students/Staff and Doctors.
- **Appointment Booking**: Dynamic slot selection based on department and doctor availability.
- **Digital Health Records**: Secure storage of diagnoses, prescriptions, and reports.
- **Medicine Tracking**: "My Medicine" tab with auto-expiry logic (hides past prescriptions).
- **Interactive UI**: Premium dark-themed aesthetic with responsive design.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Premium Dark Theme), Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via `pg` driver)
- **Security**: JWT Authentication, Bcrypt Password Hashing

## 🚀 Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Database Configuration**
    - Ensure PostgreSQL is running.
    - Create a database (e.g., `kaps_health`).
    - Create a `.env` file in the `backend/` directory:
      ```env
      DATABASE_URL=postgresql://user:password@localhost:5432/kaps_health
      JWT_SECRET=your_secure_random_secret_key
      PORT=3001
      ```

3.  **Initialize Database**
    - Run the initialization script to create tables and seed demo data:
      ```bash
      node backend/init_db.js
      ```

4.  **Run Application**
    ```bash
    node backend/server.js
    ```
    - The server will start at `http://localhost:3001`.
    - Open `http://localhost:3001` in your browser.

## 🔑 Demo Credentials

**Student Account:**
- **Email**: `student@university.edu`
- **Password**: `password123`

**Doctor Account (Neurology):**
- **Email**: `neuro_demo@health.edu` (or any seeded doctor email)
- **Password**: `password123`

## 📂 Project Structure

- `frontend/`: HTML, CSS (`style.css`), JS (`app.js`), and Assets.
- `backend/`: API Routes, Database Logic (`db.js`), and Setup Scripts (`schema.sql`, `init_db.js`).

---
*Built for the KAPS Hackathon* 🚀
