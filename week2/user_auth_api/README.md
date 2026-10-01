# User Authentication REST API

A secure authentication API built with Node.js, Express, MongoDB (Mongoose), BcryptJS, and JSON Web Tokens (JWT).

## Features
- User registration with password hashing via `bcryptjs`.
- User login authentication and JWT token generation.
- Protected profile route requiring a valid Bearer JWT header.
- MongoDB database persistence with Mongoose.
- Pre-configured Postman Collection included.

## Prerequisites
- Node.js (v14+)
- Local MongoDB or MongoDB Atlas URI.

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables (`.env`):
   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/user_auth_db
   JWT_SECRET=supersecretjwtkey_123456789
   JWT_EXPIRE=30d
   ```

3. Run Server:
   - Development Mode: `npm run dev`
   - Production Mode: `npm start`

## API Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new user & receive JWT token |
| POST | `/api/auth/login` | Public | Authenticate user credentials & receive JWT token |
| GET | `/api/auth/profile` | Private | Get user profile (Requires `Authorization: Bearer <token>`) |

## Testing with Postman
1. Import `Postman_Collection.json` into Postman.
2. Call `/api/auth/register` or `/api/auth/login` to obtain the JWT token from the response.
3. Pass the token in the `Authorization` header as `Bearer <token>` when calling `/api/auth/profile`.
