require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/ai', require('./routes/ai'));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SimhasthaNetra Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
