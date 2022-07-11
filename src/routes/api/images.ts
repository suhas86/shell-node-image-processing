import express from 'express';
import path from 'path';
import imageQueryValidator from '../../middleware/imageQueryValidator';
import { doesExists, transformImage } from '../../utils/imageHelper';

const images = express.Router();
export const imagesDir = 'images/';
export const compressedDir = 'compressed';
export const extension = '.jpg';

images.get(
  '/',
  imageQueryValidator,
  async (req: express.Request, res: express.Response): Promise<void> => {
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
      await transformImage(
        imagePath,
        Number(width),
        Number(height),
        compressedImagePath
      );
      res.status(200).sendFile(compressedImagePath);
    } catch (error) {
      res.status(500).send('oops something went wrong');
    }
  }
);

export default images;
