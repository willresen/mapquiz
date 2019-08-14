require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Promise = require('bluebird');
Promise.promisifyAll(require("redis"));
const redis = require('redis').createClient(6379);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static( __dirname + '/../client/dist/'));
app.use('/legacy', express.static(__dirname + '/../legacy/'))
app.use(express.text());

app.get('/api/locations/', (req, res) => {
})

//add a marker to the database
app.post('/api/locations', async (req, res) => {
  const locations = req.body.split('\n');
  let markers = [];

  for (location of locations) {
    await redis.getAsync(`location:${location}`)
      .then(async results => {
        if (results) {
          markers.push({ source: 'cache', location: location, results: JSON.parse(results) });
        } else {
          await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_API_KEY}`)
            .then(response => {
              response = response.data.results[0].geometry.location;
              redis.setex(`location:${location}`, 2592000, JSON.stringify(response));
              markers.push({ source: 'google', location: location, results: response });
            })
            .catch(err => res.status(404))
        }
      });
  }

  res.send(markers)
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
