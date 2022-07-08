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

export const getCompessedImageWidthAndHeight = async (
  compressedImagePath: string
): Promise<{
  existingImageWidth: number | undefined;
  existingImageHeight: number | undefined;
}> => {
  const compressedImageBuffer = await fs.readFile(compressedImagePath);
  const compressedImage = await sharp(compressedImageBuffer);
  const compressedImageMeta = await compressedImage.metadata();
  return {
    existingImageWidth: compressedImageMeta.width,
    existingImageHeight: compressedImageMeta.height
  };
};
