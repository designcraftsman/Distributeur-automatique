const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vendingRoutes = require('./routes/VendingRoutes');

const app = express();

const corsOptions = {
    origin: '*', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
const path = require('path');
app.use('/src/assets/objects', cors(corsOptions),express.static(path.join(__dirname, 'assets/objects')));

app.use(cors()); 
app.use(bodyParser.json());
app.use('/api', vendingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;