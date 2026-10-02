const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors());
app.use(express.json());

// Middleware to attach io instance to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5007;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_feed_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected for Social Feed'))
  .catch(err => console.error('MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

io.on('connection', (socket) => {
  console.log('Client connected to Socket.io WebSockets:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

server.listen(PORT, () => console.log(`Social Feed Server with Socket.io running on port ${PORT}`));
