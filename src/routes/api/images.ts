import express from 'express';

const images = express.Router();

images.get('/', (req, res) => {
  res.send('Hello World!');
});

export default images;
