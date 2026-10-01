const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fullstack_todo_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected for Full Stack To-Do'))
  .catch(err => console.error('MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('Full Stack To-Do API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
