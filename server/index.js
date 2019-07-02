require('dotenv').config();
const express = require('express');
const db = require(__dirname + '/../database/index.js');
const app = express();
const port = 3000;

app.use(express.static( __dirname + '/../client/dist/'));
app.use(express.json());

//retrieve a marker from the database
app.get('/api/locations', (req, res) => {
  db.getMarker(req.body.location)
    .then(results => res.send(results))
    .catch(err => console.log(err))
})

//add a marker to the database
app.post('/api/locations', (req, res) => {
  db.saveMarker(req.body.location)
  .then(results => res.send(results))
  .catch(err => console.log(err))
})

//retrieve a saved quiz from the database
app.get('/api/quizzes', (req, res) => {
  db.getQuiz(req.body.quiz)
  .then(results => res.send(results))
  .catch(err => console.log(err))
})

//save a quiz to the database
app.post('/api/quizzes', (req, res) => {
  db.saveQuiz(req.body.quiz)
  .then(results => res.send(results))
  .catch(err => console.log(err))
})

app.listen(port, () => console.log(`Listening on port ${port}`));