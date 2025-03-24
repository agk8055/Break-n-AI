require('dotenv').config();
const express = require('express');
const cors = require('cors');
const summarizerRoutes = require('./routes/summarizerRoutes'); // Import summarizer routes
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing application/json

// Mount summarizer routes under /api path
app.use('/api', summarizerRoutes); // Use the routes defined in summarizerRoutes.js, prefixed with /api

app.use(errorHandler); // Error handling middleware

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});