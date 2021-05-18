import express from 'express';
import http from 'http';
import config from 'config';

async function startServer () {
  const app = express();
  await require('./loaders').default({ expressApp: app });
  const server = http.createServer(app);
  await require('./websocket').default({ server });

  server.listen(config.port, () => {
    console.log(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    console.error(err);
    process.exit(1);
  });
}

startServer();
