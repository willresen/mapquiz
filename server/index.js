require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static( __dirname + '/../client/dist/'));
app.use(express.json());

app.get('/api/locations', (req, res) => {
  //retrieve a marker from the database
})

app.post('/api/locations', (req, res) => {
  //add a marker to the database
})

app.get('/api/quizzes', (req, res) => {
  //retrieve a saved quiz from the database
})

app.post('/api/quizzes', (req, res) => {
  //save a quiz to the database
})

app.listen(port, () => console.log(`Listening on port ${port}`));