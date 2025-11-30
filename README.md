# ScheduleFlow: Automated Scheduling for Modern Businesses

<p align="center">
  <img src="docs/images/scheduleflow-logo.png" alt="ScheduleFlow Logo" width="200" height="200">
</p>

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
**[Watch Demo Video](https://youtu.be/DMPaB0gt2xQ?si=M_AAhM7SW440v-di)** *(Demonstrates the application flow)*<br>
**[Live Demo](http://scheduleflow-frontend-bucket.s3-website-us-east-1.amazonaws.com/)** *(Application running on AWS)*

> **Admin Access:** To test the admin area, use the following credentials:  
> **Username:** `admin_user`  
> **Password:** `super_secret_admin_password`


**[https://fmbyteshiftsoftware.com/](https://fmbyteshiftsoftware.com/)**<br>
**[Contact for Setup](mailto:contact@fmbyteshiftsoftware.com)** *(Schedule a quick setup call)*<br>


## Technical Excellence

Built with modern, reliable technologies: Python, FastAPI, React, PostgreSQL.

---

*ScheduleFlow: Where automation meets professionalism.*

---

## Architecture & Deployment

### Application Architecture

This diagram illustrates the high-level structure of the ScheduleFlow application, showing the relationship between frontend, backend, e-mail service and database components.

![ScheduleFlow Application Architecture](docs/diagrams/architecture/scheduleflow-architecture-diagram.png) <!-- Caminho relativo à raiz do repo -->

### Deployment Flow (AWS)

This diagram shows how the application components are deployed and interact on AWS.

![ScheduleFlow Deployment on AWS](docs/diagrams/deployment/aws-deployment-architecture-1.png) <!-- Caminho relativo à raiz do repo -->

---

### ▶ Try It Locally

Want to run the full ScheduleFlow application (frontend and backend) locally? Choose your preferred setup method.

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (for Option 1)
- [Python 3.13+](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installation/) (for Option 2)
- [Node.js](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (for Option 2 - Frontend)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running (for Option 2, or if using Option 1 without the provided `docker-compose.yml` for the DB)

#### Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/python-projects-fernando/scheduleflow.git
cd scheduleflow
```

#### Environment Configuration (.env file)

Create a `.env` file in the **root directory** of the project (`ScheduleFlow/.env`) based on the `.env.example` file located there.

1.  **Copy the Example File:**
    ```bash
    # From the ScheduleFlow root directory
    cp .env.example .env
    ```
2.  **Edit the `.env` File:**
    *   Open the newly created `.env` file in a text editor.
    *   Replace the placeholder values (like `your_postgres_password`, `your-super-secret-jwt-key-change-this-in-production!`, `your_email@example.com`, etc.) with your actual credentials and settings.
    *   **For Option 1 (Docker Compose):** Ensure `DATABASE_URL` matches the internal service name (e.g., `postgresql+asyncpg://your_user:your_password@localhost/scheduleflow`).
    *   **For Option 2 (Local Execution):** Ensure `DATABASE_URL` points to your local/host PostgreSQL instance (e.g., `postgresql+asyncpg://your_user:your_password@localhost/scheduleflow`).

#### Option 1: Run with Docker Compose (Recommended)

This is the easiest way to run the entire application stack (frontend, backend, and database) with a single command.

**Important:** Ensure your **root** `.env` file contains the environment variables required for the Docker Compose setup (especially `DATABASE_URL` pointing to the internal `db` service).

1.  **Copy the Example Compose File:**
    *   Locate the `docker-compose.example.yml` file in the repository root.
    *   **Rename** it to `docker-compose.yml` in the root directory (`ScheduleFlow/`).
    *   **Review** the newly renamed `docker-compose.yml` file. Ensure the service names, build contexts, ports, and environment variable references are correct and match your setup.

2.  **Run the Application Stack:**
    ```bash   
    # Build images (if needed) and run the full application stack (frontend, backend, db)
    # Docker Compose will automatically load environment variables from the .env file in the current directory
    docker-compose up --build
    ```

*   The **Backend API** will be available at **http://localhost:8000**
*   The **Backend API Documentation** will be accessible at **http://localhost:8000/docs**
*   The **Frontend** will be available at **http://localhost:5173** (or the port you mapped in `docker-compose.yml`)
*   The **Database** (PostgreSQL) will be accessible internally within the Docker network as `db:5432` and externally on your host machine as `localhost:5432` (mapped by the compose file).

> **Note:** The initial build might take a few minutes as it downloads dependencies and builds the frontend bundle and backend environment.

#### Option 2: Run Services Separately (Local Execution)

If you prefer to run the backend and frontend services directly on your host machine (outside of Docker), follow these steps.

**Important:** Ensure your **root** `.env` file contains the environment variables required for local execution (especially `DATABASE_URL` pointing to your local PostgreSQL instance).

1.  **Set up the Backend:**
    *   **Navigate to the Backend Directory:**
        ```bash
        cd backend
        ```
    *   **Set up Virtual Environment (Recommended):**
        ```bash
        # Create a virtual environment named .venv
        python -m venv .venv

        # Activate the virtual environment
        # On Windows:
        .venv\Scripts\activate
        # On macOS/Linux:
        source .venv/bin/activate
        ```
    *   **Install Dependencies:**
        ```bash
        pip install -e .
        pip install -r requirements.txt
        pip install -r requirements-dev.txt # If you plan to run tests
        ```
    *   **Ensure your root `.env` file is configured correctly for local DB access.**
    *   **Ensure your local PostgreSQL instance is running and the `scheduleflow` database exists.**
    *   **Run the Backend Application (from the root project directory `ScheduleFlow/`):**
        ```bash
        # Navigate back to the root directory first if you were in /backend
        cd ..

        # Run the application using uvicorn
        uvicorn backend.interfaces.main:app --reload
        ```
        The **Backend API** will be running at **http://localhost:8000**  
        Access the interactive API documentation at **http://localhost:8000/docs**.

2.  **Set up the Frontend (in a new terminal):**
    *   **Navigate to the Frontend Directory:**
        ```bash
        cd frontend # From the root directory ScheduleFlow/
        ```
    *   **Install Frontend Dependencies (only needed once or after package.json changes):**
        ```bash
        npm install
        ```
    *   **Ensure your `frontend/.env` file (if it exists) or the root `.env` is configured for local backend access (e.g., `VITE_API_BASE_URL=http://localhost:8000/api`).**
    *   **Run the Frontend Development Server:**
        ```bash
        npm run dev
        ```
        The **Frontend** will be available at **http://localhost:5173** (or another port if 5173 is taken, Vite will show the correct number in the terminal).

> ⚠ **Note**: This is a focused, production-grade reference implementation for appointment scheduling—not a full SaaS. It demonstrates how Clean Architecture and modern Python & React practices can deliver real business value.

---

**ScheduleFlow: Because managing appointments shouldn't be a hassle.**
