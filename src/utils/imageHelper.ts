import { promises as fs } from 'fs';
import sharp from 'sharp';

export const doesExists = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export const getImageWidthAndHeight = async (
  imagePath: string
): Promise<{
  existingImageWidth: number | undefined;
  existingImageHeight: number | undefined;
}> => {
  const imageBuffer = await fs.readFile(imagePath);
  const image = await sharp(imageBuffer);
  const imageMeta = await image.metadata();
  return {
    existingImageWidth: imageMeta.width,
    existingImageHeight: imageMeta.height
  };
};
