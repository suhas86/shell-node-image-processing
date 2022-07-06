import express from 'express';
import images from './api/images';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Hello from image processing routes!!!');
});

routes.use('/api/images', images);

export default routes;
