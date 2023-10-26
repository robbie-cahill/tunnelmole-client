import fs from 'fs';
import { ROOT_DIR } from '../filesystem/constants.js';

const packageJson = JSON.parse(fs.readFileSync(`${ROOT_DIR}/package.json`).toString());

export { packageJson }