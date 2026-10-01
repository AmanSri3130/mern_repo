# Image Upload Feature (Express + Multer + React)

A full-stack image file uploader with real-time browser preview, Multer server storage, and dynamic image gallery rendering.

## Features
- **Express Backend**: Configured with `multer.diskStorage` for handling multipart/form-data.
- **Image Validation**: File type filtering (image/* only) and 5MB size limit.
- **Static File Serving**: Serves `/uploads` endpoint.
- **React Frontend**:
  - Live client-side preview before uploading (`URL.createObjectURL`).
  - Image gallery displaying all uploaded files.

## How to Run

### Backend Setup:
```bash
cd backend
npm install
npm run dev # Starts on http://localhost:5004
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev # Starts Vite server
```
