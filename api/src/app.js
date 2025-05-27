const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vendingRoutes = require('./routes/VendingRoutes');

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use('/api', vendingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;