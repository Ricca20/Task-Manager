const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling
const errorHandler = require('./middlewares/errorMiddleware');
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Task Manager API' });
});

module.exports = app;
