# Task Manager Application (Mini Project)

A complete task tracking web application featuring user registration, JWT authentication, task filtering (status, priority, search keywords), and full CRUD functionality.

## Features
- **Frontend (React + Vite)**:
  - User Signup & Login with JWT session persistence.
  - Interactive Dashboard with real-time statistics (Total, Pending, Completed).
  - Search input & Multi-filter dropdowns for Status & Priority.
  - Dynamic Modal for Creating & Editing tasks.
  - Delete task action.
- **Backend (Express + MongoDB)**:
  - JWT Authentication middleware protecting all task routes.
  - Password hashing via `bcryptjs`.
  - MongoDB Mongoose schema with `user` reference for data isolation.

## How to Run

### Backend Setup:
```bash
cd backend
npm install
npm run dev # Runs on http://localhost:5005
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev # Runs Vite dev server
```
