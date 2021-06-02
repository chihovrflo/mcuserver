import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { urlencoded } from 'body-parser';
import getUniqueID from 'websocket/getUniqueID';
const route = Router();
const urlencodedParser = urlencoded({extended: false});
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const mculistPath = resolveApp('./mculist.json');

export default function (app) {
  app.use('/mcu', route);
  
  route.get('/getlist', (req, res) => {
    fs.readFile(mculistPath, 'utf8', (err, data) => {
      if(err) console.log("error: ", err);
      res.send(data);
    })
  })

  route.post('/addlist', urlencodedParser, (req, res) => {
    fs.readFile(mculistPath, 'utf8', (err, data) => {
      var obj = JSON.parse(data);
      var exists = false;
      obj.list.forEach(item => {
        if((item.name === req.body.name)||(item.host === req.body.host)){
          exists = true;
        }
      })
      if(exists)
        res.send('already existed').status(400);
      else{
        obj.list.push({
          id: getUniqueID(),
          ...req.body,
        });
        fs.writeFile(mculistPath, JSON.stringify(obj), (err, res) => {
          if(err) console.log("error: ", err);
        })
        res.send('OK').status(200);
      }
    })
  })

  route.post('/updatelist', urlencodedParser, (req, res) => {
    fs.readFile(mculistPath, 'utf8', (err, data) => {
      var obj = JSON.parse(data);
      var newlist = obj.list.map(item => (item.id === req.body.id) ? req.body : item)
      obj.list = newlist; 
      fs.writeFile(mculistPath, JSON.stringify(obj), (err, res) => {
        if(err) console.log("error: ", err);
      })
      res.send('OK').status(200);
    })
  })

  route.get('/list', (req, res) => {
    return res.send('mcu list').status(200);
  });

  route.get('/:name', (req, res) => {
    return res.send(req.params.name).status(200);
  });
};
