require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.route');

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

// Add CROS Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Domain frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow Methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if want to send cookies or authentication headers
  })
);

app.use('/pentama-api', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Semething went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
