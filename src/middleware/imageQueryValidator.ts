import { Request, Response, NextFunction } from 'express';

const imageQueryValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  next();
};

export default imageQueryValidator;
