# KAPS MedTech 🏥

A comprehensive healthcare management system connecting Students/Staff with University Doctors.  
*Built for the KAPS Hackathon* 🚀

---

## 📖 Overview

**KAPS MedTech** is a full-stack web application designed to streamline university healthcare services. It bridges the gap between students/staff and university doctors by providing a centralized platform for appointment booking, digital health records, and prescription management.

The system ensures privacy and efficiency with role-based access control, real-time slot management, and a premium user interface.

## 🌟 Key Features

### 👨‍🎓 For Students & Staff (`user` role)
-   **Smart Dashboard**: View upcoming appointments, recent medical history, and quick actions.
-   **Easy Appointment Booking**: Browse doctors by department, view real-time availability, and book slots instantly.
-   **My Medicine Cabinet**: Track active prescriptions with auto-expiry logic (hides past medications).
-   **Digital Reports**: Access diagnosis history and laboratory reports securely.

### 👨‍⚕️ For Doctors (`doctor` role)
-   **Doctor's Console**: Manage patient queues and view daily appointment schedules.
-   **Digital Prescriptions**: Write and issue digital prescriptions directly to usage records.
-   **Patient History**: Access past medical records of students/staff for informed diagnosis.

### 🎨 General
-   **Premium UI/UX**: Modern, dark-themed aesthetic with responsive design for all devices.
-   **Secure Authentication**: Robust login system using JWT and Bcrypt.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JS | Lightweight, fast, and custom-styled with a premium dark theme. |
| **Backend** | Node.js, Express.js | RESTful API architecture for scalable logic. |
| **Database** | PostgreSQL | Relational database for structured data (Users, Appointments, Records). |
| **Driver** | `pg` (node-postgres) | Non-blocking PostgreSQL client for Node.js. |
| **Deployment** | Vercel + Neon | Serverless frontend/backend (Vercel) and serverless Postgres (Neon). |

---

## � Project Structure

```bash
KAPS_MedTech/
├── backend/                # Server-side logic
│   ├── routes/             # API Endpoints (Auth, Appointments, Doctor)
│   ├── middleware/         # Auth verification middleware
│   ├── db.js               # Database connection pool
│   ├── init_db.js          # Database initialization & seeding script
│   ├── server.js           # Main Express server entry point
│   └── schema.sql          # SQL schema definition
├── frontend/               # Client-side interface
│   ├── css/                # Custom styles (style.css, variables)
│   ├── js/                 # Frontend logic (app.js, dashboard scripts)
│   ├── img/                # Assets and icons
│   └── *.html              # Application pages (index, dashboards)
├── README.md               # Project documentation
└── package.json            # Dependencies and scripts configuration
```

---

## 🚀 Local Development Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [PostgreSQL](https://www.postgresql.org/) (Installed and running locally)

### 1. Clone the Repository
```bash
git clone https://github.com/Pushpam-2404/KAPS_MedTech.git
cd KAPS_MedTech
```

### 2. Install Dependencies
Install the required Node.js packages for the backend.
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the **`backend/`** directory.
```bash
# Create file: backend/.env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/kaps_health
JWT_SECRET=your_super_secret_random_key_here
PORT=3001
```
*Note: Replace `your_user`, `your_password`, and `kaps_health` with your local Postgres credentials.*

### 4. Initialize Database
Run the setup script to create tables and seed the database with demo data (Students, Doctors, Depts).
```bash
node backend/init_db.js
```
*You should see a success message indicating tables were created and seed data inserted.*

### 5. Run the Server
Start the backend server (which also serves the frontend files).
```bash
node backend/server.js
```
The server will start at: `http://localhost:3001`

### 6. Access the App
Open your browser and enter:
`http://localhost:3001`

---

## ☁️ Deployment Guide (Vercel + Neon)

Since this app uses a database, we cannot just deploy to a static host. We use **Vercel** for the app and **Neon** for the serverless PostgreSQL database.

### 1. Set up Cloud Database (Neon)
1.  Go to [Neon.tech](https://neon.tech) and Sign Up.
2.  Create a Project (e.g., `KAPS_MedTech`).
3.  Copy the **Connection String** (e.g., `postgres://user:pass@...neon.tech/neondb?sslmode=require`).

### 2. Initialize Cloud DB
Run the init script from your local machine, pointing to the Cloud DB.
```bash
# Run this in your local terminal
DATABASE_URL="YOUR_NEON_CONNECTION_STRING" node backend/init_db.js
```

### 3. Deploy to Vercel
1.  Push your code to **GitHub**.
2.  Go to [Vercel](https://vercel.com) -> **Add New Project**.
3.  Import your repository.
4.  **Environment Variables** (IMPORTANT):
    Add the following in Vercel settings:
    -   `DATABASE_URL`: *Paste your Neon Connection String*
    -   `JWT_SECRET`: *Any secure random string*
5.  Click **Deploy**.

---

## 🔌 API Overview

| Method | Endpoint | Description |
| :---| :---| :---|
| **POST** | `/api/auth/login` | Authenticate user (Student/Doctor). |
| **GET** | `/api/appointments/doctors` | List available doctors by department. |
| **POST** | `/api/appointments/book` | Book a new appointment. |
| **GET** | `/api/doctor/appointments` | Get confirmed appointments for a doctor. |
| **POST** | `/api/doctor/diagnose` | Submit a diagnosis and prescription. |

---

## 🔑 Demo Credentials

**Student Account:**
-   **Email**: `student@university.edu`
-   **Password**: `password123`

**Doctor Account (Neurology):**
-   **Email**: `neuro_demo@health.edu`
-   **Password**: `password123`
