import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  doesExists,
  getCompessedImageWidthAndHeight
} from '../../utils/imageHelper';

const images = express.Router();
const imagesDir = 'images/';
const compressedDir = 'compressed';
const extension = '.jpg';

images.get('/', async (req, res) => {
  const { filename, width, height } = req.query;

  // If file name not provided return 400
  if (!filename) {
    res.status(400).send('Filename is required');
    return;
  }

  // If width and height are providded and are numbers, then we can proceed
  if (height && width && isNaN(Number(width)) && isNaN(Number(height))) {
    res.status(400).send('Width and height must be numbers');
    return;
  }
  // If width and height are provided and are positive numbers, then we can proceed
  if ((height && width && Number(width) < 0) || Number(height) < 0) {
    res.status(400).send('Width and height must be positive');
    return;
  }
  try {
    const compressedImagePath = `${path.resolve(
      __dirname,
      `../../../${compressedDir}/${filename}${extension}`
    )}`;
    const imagePath = `${path.resolve(
      __dirname,
      `../../../${imagesDir}/${filename}${extension}`
    )}`;
    if (!(await doesExists(imagePath))) {
      res.status(404).send('Image not found');
      return;
    }
    // If no height and width is provided, then we can return the original image
    if (!width && !height) {
      res.sendFile(imagePath);
      return;
    }
    // Get image from cache or from disk
    if (await doesExists(compressedImagePath)) {
      const { existingImageHeight, existingImageWidth } =
        await getCompessedImageWidthAndHeight(compressedImagePath);
      if (existingImageWidth == width && existingImageHeight == height) {
        res.sendFile(compressedImagePath);
        return;
      }
    }

    const inputBuffer = await fs.readFile(imagePath);
    sharp(inputBuffer)
      .resize(Number(width), Number(height))
      .toFile(compressedImagePath, (err) => {
        if (err) {
          console.log('Error while resizing image: ', err);
          res.status(500).send(err);
        } else {
          res.status(200).sendFile(compressedImagePath);
        }
      });
  } catch (error) {
    res.status(500).send('oops something went wrong');
  }
});

export default images;
