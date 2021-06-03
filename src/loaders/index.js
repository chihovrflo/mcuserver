import expressLoader from './express';

export default async function ({ expressApp }) {
  await expressLoader({ app: expressApp });
  console.log('✌️ Express loaded');
};
