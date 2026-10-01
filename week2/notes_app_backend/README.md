# Notes App Backend (Mini Project)

A complete RESTful API backend for a note-taking application, built with Node.js, Express, MongoDB (Mongoose), and secured with JWT Authentication.

## Features
- **User Authentication**:
  - Register & Login with password encryption using `bcryptjs`.
  - JWT token generation and authorization check.
- **Notes Management (CRUD)**:
  - Create, Read, Update, and Delete notes.
  - Search notes by keyword in title/content.
  - Filter notes by category or pinned status.
  - User-level data isolation (users can only access their own notes).
- **Postman Testing Collection**: Included `Postman_Collection.json`.

## Project Structure
```text
notes_app_backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Note.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   └── server.js
├── .env
├── package.json
├── Postman_Collection.json
└── README.md
```

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables** (`.env`):
   ```env
   PORT=5002
   MONGO_URI=mongodb://127.0.0.1:27017/notes_app_db
   JWT_SECRET=notes_app_jwt_secret_key_987654321
   JWT_EXPIRE=30d
   ```

3. **Start the server**:
   - Dev mode: `npm run dev`
   - Prod mode: `npm start`

## API Endpoints

### Auth Endpoints
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register new user account |
| POST | `/api/auth/login` | Public | Login user & get JWT token |
| GET | `/api/auth/me` | Private | Get authenticated user info |

### Notes Endpoints (All require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/notes` | Create a new note |
| GET | `/api/notes` | Get all notes for user (Query params: `?search=term&category=Study&isPinned=true`) |
| GET | `/api/notes/:id` | Get specific note by ID |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## Postman Testing
1. Import `Postman_Collection.json` into Postman.
2. Register/Login to receive the JWT token.
3. Use the token in headers under `Authorization: Bearer <token>` for all Notes routes.
