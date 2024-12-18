const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const riskProfileRoutes = require('./routes/riskprofiles'); // Adjust path as necessary
const orderRoutes = require('./routes/order'); // Adjust path as necessary
const goalRoutes = require('./routes/goal');
const apiConnectionRoutes = require('./routes/api');
// Express app
const app = express();

// Middleware
app.use(cors({})); // Ensure CORS is configured here
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/riskprofiles', riskProfileRoutes);
app.use('/api/order',orderRoutes );
app.use('/api/goal',goalRoutes )

app.use('/api/connection', apiConnectionRoutes); // Add the route to the application

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI; // Ensure the database name is correct

mongoose.connect(mongoURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to MongoDB and listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
