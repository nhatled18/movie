const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
require('dotenv').config();

const app = express();
const PORT = 3001; // Viết trực tiếp

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'MyMovie API đang chạy!' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});