import { Router } from 'express';
const route = Router();

export default function (app) {
  app.use('/mcu', route);

  route.get('/list', (req, res) => {
    return res.send('mcu list').status(200);
  });

  route.get('/:name', (req, res) => {
    return res.send(req.params.name).status(200);
  });
};
