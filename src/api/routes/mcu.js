import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { urlencoded } from 'body-parser';
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
      var isExist = false;
      obj.list.forEach(item => {
        if((item.name === req.body.name)||(item.host === req.body.host)){
          isExist = true;
        }
      })
      if(isExist)
        res.send('already exist').status(400);
      else{
        obj.list.push(req.body);
        fs.writeFile(mculistPath, JSON.stringify(obj), (err, res) => {
          if(err) console.log("error: ", err);
        })
        res.send('OK').status(200);
      }
    })
  })

  route.get('/list', (req, res) => {
    return res.send('mcu list').status(200);
  });

  route.get('/:name', (req, res) => {
    return res.send(req.params.name).status(200);
  });
};
