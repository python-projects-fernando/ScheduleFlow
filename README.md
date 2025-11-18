# ScheduleFlow: Automated Scheduling for Modern Businesses

**ScheduleFlow** transforms how your business handles appointments. It eliminates back-and-forth scheduling and provides a professional, effortless booking experience for your clients—all managed through a simple, powerful dashboard.

## Why ScheduleFlow?

- **Reduce No-Shows Dramatically**: Automated confirmation and reminder emails/SMS keep clients informed and engaged, significantly lowering missed appointments.
- **Save Time & Resources**: Stop manual coordination. Clients book instantly online, freeing up your staff for what matters most.
- **Enhance Customer Experience**: Offer 24/7 availability, easy rescheduling, and seamless cancellations via secure links—no login needed.
- **Gain Operational Insight**: Track bookings, manage schedules, and optimize capacity with a clear, intuitive admin view.
- **Built for Scalability**: Robust, secure architecture designed to grow with your business.

Perfect for: Clinics, Salons, Consultants, Therapists, Tutoring Services, and any appointment-based business.

## Core Features

- **Effortless Online Booking**: Clients view real-time availability and book instantly.
- **Smart Automated Communications**: Confirmation and reminder emails/SMS sent automatically.
- **Secure Self-Service**: Cancel or reschedule appointments effortlessly using unique links.
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

Want to run the ScheduleFlow API locally? First, configure your environment variables, then choose your preferred method.

#### Environment Configuration (.env file)

Create a `.env` file in the **root directory** of the project (`ScheduleFlow/.env`).

Example `.env` content:
```
# Database Connection (PostgreSQL)
DATABASE_URL=postgresql+asyncpg://user:password@localhost/scheduleflow

# JWT Secret Key (Change this in production!)
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production!

# Admin Credentials
ADMIN_USERNAME=admin_user
ADMIN_PASSWORD=super_secret_admin_password

# Email Configuration (for appointment notifications)
EMAIL_ADDRESS=your_email@example.com
EMAIL_PASSWORD=your_app_password_or_smtp_password
SMTP_SERVER=smtp.yourprovider.com
SMTP_PORT=587
```

#### Option 1: Run with Docker Compose (Recommended for Production-like setup)

This is the easiest way to run the full application stack with a single command.
```bash
# Clone the repository
git clone https://github.com/python-projects-fernando/scheduleflow.git    
cd scheduleflow

# Build and run the full application (backend + database)
docker-compose up --build
```

The API will be available at **http://localhost:8000**  
The API documentation will be accessible at **http://localhost:8000/docs**.

#### Option 2: Run Services Separately (Recommended for Development)

If you prefer to run services individually for development:

1.  **Backend (FastAPI + PostgreSQL/SQLite)**:
    ```bash
    # Navigate to the backend directory
    cd backend

    # Create and activate virtual environment (recommended)
    python -m venv .venv
    # On Windows:
    .venv\Scripts\activate
    # On macOS/Linux:
    source .venv/bin/activate

    # Install dependencies
    pip install -r requirements.txt
    pip install -r requirements-dev.txt # If you plan to run tests

    # Ensure your .env file is configured correctly at the project root
    # Ensure your database is running and accessible via DATABASE_URL

    # Run the application (from the root project directory, not from backend/)
    # Navigate back to the root directory first
    cd ..
    uvicorn backend.interfaces.main:app --reload
    ```
    The API will be running at **http://localhost:8000**  
    Access the interactive API documentation at **http://localhost:8000/docs**.


> ⚠ **Note**: This is a focused, production-grade reference implementation for appointment scheduling—not a full SaaS. It demonstrates how Clean Architecture and modern Python practices can deliver real business value.

---

**ScheduleFlow: Because managing appointments shouldn't be a hassle.**