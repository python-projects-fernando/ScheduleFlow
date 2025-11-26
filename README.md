# ScheduleFlow: Automated Scheduling for Modern Businesses

**ScheduleFlow** transforms how your business handles appointments. It eliminates back-and-forth scheduling and provides a professional effortless booking experience for your clients, all managed through a simple and powerful dashboard.

## Why ScheduleFlow?

- **Reduce No-Shows Dramatically**: Automated confirmation emails keep clients informed and engaged, significantly lowering missed appointments.
- **Save Time & Resources**: Stop manual coordination. Clients book instantly online, freeing up your staff for what matters most.
- **Enhance Customer Experience**: Offer 24/7 availability, easy rescheduling, and seamless cancellations via secure links, no login needed.
- **Gain Operational Insight**: Track bookings, manage schedules, and optimize capacity with a clear, intuitive admin view.
- **Built for Scalability**: Robust, secure architecture designed to grow with your business.

Perfect for: Clinics, Salons, Consultants, Therapists, Tutoring Services, and any appointment-based business.

## Core Features

- **Effortless Online Booking**: Clients view real-time availability and book instantly.
- **Smart Automated Communications**: Clients receive instant confirmation via email.
- **Secure Self-Service**: Cancel or view appointments effortlessly using unique links.
- **Centralized Admin Dashboard**: Manage all appointments, services, and availability from one place.
- **Quick Deployment**: Designed for easy setup and integration.

## Experience the Flow

Ready to streamline your scheduling process?  
**[Live Demo Link]** *(Available Soon)*  
**[Contact for Setup]** *(Schedule a quick setup call)*

## Technical Excellence

Built with modern, reliable technologies: Python, FastAPI, React, PostgreSQL.

---

*ScheduleFlow: Where automation meets professionalism.*

---

### ▶ Try It Locally (for developers)

Want to run the ScheduleFlow API and frontend locally? First, configure your environment variables, then choose your preferred method for the backend and run the frontend separately.

#### Environment Configuration (.env file)

Create a `.env` file in the **root directory** of the project (`ScheduleFlow/.env`) based on the `.env.example` file located there.

1.  **Copy the Example File:**
    ```bash
    # From the ScheduleFlow root directory
    cp .env.example .env
    ```
2.  **Edit the `.env` File:**
    *   Open the newly created `.env` file in a text editor.
    *   Replace the placeholder values (like `user`, `password`, `your-super-secret-jwt-key-change-this-in-production!`, `your_email@example.com`, etc.) with your actual credentials and settings.

Example `.env` content (after filling in your values):
```env
# Database Connection (PostgreSQL)
DATABASE_URL=postgresql+asyncpg://your_username:your_password@localhost/your_database_name

# Admin API Token (used for some administrative tasks)
ADMIN_API_TOKEN=your_secure_admin_api_token

# JWT Secret Key (Change this in production!)
SECRET_KEY=your-very-long-secret-key-for-jwt-tokens

# Default Admin Credentials (change these!)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password

# Email Configuration (for appointment notifications)
EMAIL_ADDRESS=your_notification_email@example.com
EMAIL_PASSWORD=your_app_specific_password
SMTP_SERVER=smtp.your-email-provider.com
SMTP_PORT=587

# Frontend Base URL (for magic links in emails)
FRONTEND_BASE_URL=http://localhost:5173
```

#### Frontend Environment Configuration (.env file)

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend
    ```
2.  **Copy the Example Environment File:**
    ```bash
    cp .env.example .env
    ```
3.  **Edit the `.env` File:**
    *   Open the newly created `.env` file in a text editor.
    *   Update the `VITE_API_BASE_URL` to point to your backend server's API endpoint:
        *   For local development (if backend runs on `http://localhost:8000` and serves the API under `/api`): `VITE_API_BASE_URL=http://localhost:8000/api`
        *   Adjust if your backend runs on a different port or path.

#### Option 1: Run Backend with Docker Compose (Recommended for Production-like setup)

This is the easiest way to run the **backend** and database with a single command.

**Important:** Ensure your **root** `.env` file (placed in the project root `ScheduleFlow/`) contains all the necessary environment variables as shown in the example above.

1.  **Copy the Example Compose File:**
    *   Locate the `docker-compose.example.yml` file in the repository root.
    *   **Rename** it to `docker-compose.yml` in the root directory (`ScheduleFlow/`).
    *   **Edit** the newly renamed `docker-compose.yml` file. Replace all placeholder values (like `<YOUR_POSTGRES_PASSWORD>`, `<YOUR_DATABASE_URL>`) with your actual credentials and settings. These should ideally match the variables defined in your root `.env` file.

2.  **Run the Backend:**
    ```bash
    # Clone the repository (if you haven't already)
    git clone https://github.com/python-projects-fernando/scheduleflow.git
    cd scheduleflow

    # Build and run the backend and database
    # Docker Compose will automatically load environment variables from the .env file in the current directory
    docker-compose up --build
    ```

The **Backend API** will be available at **http://localhost:8000**  
The API documentation will be accessible at **http://localhost:8000/docs**.

#### Option 2: Run Backend Services Separately (Recommended for Development)

If you prefer to run the **backend** services individually for development:

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```
2.  **Set up Virtual Environment (Recommended):**
    ```bash
    # Create a virtual environment named .venv
    python -m venv .venv

    # Activate the virtual environment
    # On Windows:
    .venv\Scripts\activate
    # On macOS/Linux:
    source .venv/bin/activate
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    pip install -r requirements-dev.txt # If you plan to run tests
    ```
4.  **Ensure your root `.env` file is configured correctly.**
5.  **Ensure your database is running and accessible via DATABASE_URL.**
6.  **Run the Backend Application (from the root project directory `ScheduleFlow/`):**
    ```bash
    # Navigate back to the root directory first if you were in /backend
    cd ..

    # Run the application using uvicorn
    uvicorn backend.interfaces.main:app --reload
    ```
    The **Backend API** will be running at **http://localhost:8000**  
    Access the interactive API documentation at **http://localhost:8000/docs**.

#### Running the Frontend (React + Vite)

After starting the backend (using either Option 1 or Option 2), open a **new terminal window/tab**, navigate to the `frontend` directory, and run the frontend development server:

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd frontend # From the root directory ScheduleFlow/
    ```
2.  **Install Frontend Dependencies (only needed once or after package.json changes):**
    ```bash
    npm install
    ```
3.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The **Frontend** will be available at **http://localhost:5173** (or another port if 5173 is taken, Vite mostrará o número correto no terminal).

> ⚠ **Note**: This is a focused, production-grade reference implementation for appointment scheduling—not a full SaaS. It demonstrates how Clean Architecture and modern Python & React practices can deliver real business value.

---

**ScheduleFlow: Because managing appointments shouldn't be a hassle.**