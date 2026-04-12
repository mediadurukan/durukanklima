require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server works!' });
});

module.exports = app;
