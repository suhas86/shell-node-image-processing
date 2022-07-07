import express from 'express';
import { promises as fs } from 'fs';

const images = express.Router();
const imagesDir = 'images/';

images.get('/', async (req, res) => {
  const { filename, width, height } = req.query;
  // If file name not provided return 400
  if (!filename) {
    res.status(400).send('Filename is required');
    return;
  }
  // If width and height are providded and are numbers, then we can proceed
  if (width && height && isNaN(Number(width)) && isNaN(Number(height))) {
    res.status(400).send('Width and height must be numbers');
    return;
  }
  try {
    const inputBuffer = await fs.readFile(`${imagesDir}${filename}`);
    console.log('Image', inputBuffer);
    res.send('Hello World!');
  } catch (error) {
    res.status(404).send('Image not found');
  }
});

export default images;
