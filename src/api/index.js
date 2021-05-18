import { Router } from 'express';
import mcu from './routes/mcu';

export default function () {
  const app = Router();
  mcu(app);
  return app;
};
