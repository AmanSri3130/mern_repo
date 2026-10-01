# To-Do List REST API

A Node.js & Express REST API with MongoDB (Mongoose) for managing tasks.

## Features
- Create, Read, Update, and Delete (CRUD) tasks.
- Filter tasks by completed status or priority.
- MongoDB database integration using Mongoose.
- Error handling middleware.
- Pre-configured Postman Collection included for quick testing.

## Prerequisites
- Node.js (v14+)
- MongoDB running locally or a MongoDB Atlas connection string.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Copy `.env` and set your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/todo_db
   ```

3. Run the Server:
   - Development Mode (with nodemon):
     ```bash
     npm run dev
     ```
   - Production Mode:
     ```bash
     npm start
     ```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks (Supports `?completed=true` or `?priority=high`) |
| GET | `/api/tasks/:id` | Get single task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Testing with Postman
Import the `Postman_Collection.json` file into Postman to test all endpoints.
