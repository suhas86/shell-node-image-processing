import express from 'express';
import routes from './routes';

const app = express();
const port = 3000;

app.use(routes);

app.listen(port, (): void => {
  console.log(`Server is running on port ${port}`);
});

export { app };
