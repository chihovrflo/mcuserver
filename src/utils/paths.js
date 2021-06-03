import fs from 'fs';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const mculistPath = resolveApp('./mculist.json');

export {
  mculistPath
};
