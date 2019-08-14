const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

/***********
 * SCHEMAS *
 ***********/

const markerSchema = new mongoose.Schema({
  name: 'string',
  id: 'string',
  last_used: 'date',
  count: 'number'
}, {strict: true, strictQuery: true});

const quizSchema = new mongoose.Schema({
  marker_positions: 'mixed'
});

/**********
 * MODELS *
 **********/

const Marker = mongoose.model('Marker', markerSchema);
const Quiz = mongoose.model('Quiz', quizSchema);

/***********
 * QUERIES *
 ***********/

const getMarker = (name) => {
  return Marker.find({name: name});
};

const saveMarker = (marker) => {
  return Marker.findOneAndUpdate({id: marker.id}, marker, {upsert: true, new: true});
};

const getQuiz = (id) => {
  return Quiz.find({_id: id});
};

const saveQuiz = (quiz) => {
  return Quiz.findOneAndUpdate({_id: quiz.id}, quiz, {upsert: true, new: true});
};

/***********
 * EXPORTS *
 ***********/

module.exports = {
  saveQuiz,
  getQuiz,
  getMarker,
  saveMarker
};