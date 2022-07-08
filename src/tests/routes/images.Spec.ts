import request from 'supertest';
import { app } from '../../index';

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
});
