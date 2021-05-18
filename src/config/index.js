import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),
  // db setting
  // databaseURL: process.env.MONGODB_URI,

  // winston logger setting
  // logs: {
  //   level: process.env.LOG_LEVEL || 'silly',
  // },

  // api setting
  api: {
    prefix: '/api'
  }
};
