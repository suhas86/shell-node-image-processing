import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import imageQueryValidator from '../../middleware/imageQueryValidator';
import { doesExists } from '../../utils/imageHelper';

const images = express.Router();
export const imagesDir = 'images/';
export const compressedDir = 'compressed';
export const extension = '.jpg';

images.get('/', imageQueryValidator, async (req, res) => {
  const { filename, width, height } = req.query;
  try {
    const compressedImagePath = `${path.resolve(
      __dirname,
      `../../../${compressedDir}/${filename}-${width}-${height}${extension}`
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
      res.sendFile(compressedImagePath);
      return;
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
