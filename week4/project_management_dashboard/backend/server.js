const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5008;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_dashboard_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected for Project Dashboard'))
  .catch(err => console.error('MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

app.get('/', (req, res) => res.send('Project Management Dashboard API Running'));

app.listen(PORT, () => console.log(`Project Dashboard Server running on port ${PORT}`));
