require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// API call to fetch Astronomy Picture of the Day (APOD)
app.get('/apod', async (req, res) => {
  try {
    const image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/rovers/:name', async (req, res) => {
  try {
    const images = await fetch(
      `${process.env.ROVER_ENDPOINT}/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(images);
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () =>
  console.log(`Mars dashboard server listening on port ${port}!`)
);
