import path from 'path';
import request from 'supertest';
import { app } from '../../index';
import { compressedDir, extension } from '../../routes/api/images';
import { getImageWidthAndHeight } from '../../utils/imageHelper';

describe('Images API', () => {
  describe('Validate api request', () => {
    it('should check if request has filename', async () => {
      const response = await request(app).get('/api/images');
      expect(response.status).toBe(400);
    });
    it('should check if image is available', async () => {
      const response = await request(app).get('/api/images?filename=test');
      expect(response.status).toBe(404);
    });
    it('should be numerical width and height', async () => {
      const response = await request(app).get(
        '/api/images?filename=test&width=a&height=b'
      );
      expect(response.status).toBe(400);
    });
    it('should be positive width and height', async () => {
      const response = await request(app).get(
        '/api/images?filename=fjord&width=-200&height=-200'
      );
      expect(response.status).toBe(400);
    });
  });
  describe('Get image', () => {
    it('should return compressed image with width and height of 200px', async () => {
      await request(app).get('/api/images?filename=fjord&width=200&height=200');
      const imagePath = `${path.resolve(
        __dirname,
        `../../../${compressedDir}/fjord-200-200${extension}`
      )}`;
      const { existingImageHeight, existingImageWidth } =
        await getImageWidthAndHeight(imagePath);
      expect(existingImageHeight).toBe(200);
      expect(existingImageWidth).toBe(200);
    });
    it('Should return original image if no width and height is provided', async () => {
      const response = await request(app).get('/api/images?filename=fjord');
      expect(response.status).toBe(200);
    });
  });
});
