import fs from 'fs';
import { Router } from 'express';
import { urlencoded } from 'body-parser';
import getUniqueID from 'utils/getUniqueID';
import { mculistPath } from 'utils/paths';
const route = Router();
const urlencodedParser = urlencoded({ extended: false });

export default function (app) {
  app.use('/mcu', route);

  route.get('/getlist', (req, res) => {
    fs.readFile(mculistPath, 'utf8', (err, data) => {
      if (err) console.log('error: ', err);
      res.send(data);
    });
  });

  route.post('/addlist', urlencodedParser, (req, res) => {
    fs.readFile(mculistPath, 'utf8', (_err, data) => {
      const obj = JSON.parse(data);
      let exists = false;
      obj.list.forEach(item => {
        if ((item.name === req.body.name) || (item.host === req.body.host)) {
          exists = true;
        }
      });
      if (exists) { res.send('already existed').status(400); } else {
        obj.list.push({
          id: getUniqueID(),
          ...req.body
        });
        fs.writeFile(mculistPath, JSON.stringify(obj), (err, res) => {
          if (err) console.log('error: ', err);
        });
        res.send('OK').status(200);
      }
    });
  });

  route.post('/updatelist', urlencodedParser, (req, res) => {
    fs.readFile(mculistPath, 'utf8', (_err, data) => {
      const obj = JSON.parse(data);
      const newlist = obj.list.map(item => (item.id === req.body.id) ? req.body : item);
      obj.list = newlist;
      fs.writeFile(mculistPath, JSON.stringify(obj), (err, res) => {
        if (err) console.log('error: ', err);
      });
      res.send('OK').status(200);
    });
  });
};
