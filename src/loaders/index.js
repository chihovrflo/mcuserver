import expressLoader from './express';

export default async function ({ expressApp }) {
  // const mongoConnection = await mongooseLoader();
  // console.log('✌️ DB loaded and connected!');

  await expressLoader({ app: expressApp });
  console.log('✌️ Express loaded');
};
