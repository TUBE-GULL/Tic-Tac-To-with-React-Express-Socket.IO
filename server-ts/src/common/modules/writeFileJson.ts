import fs from 'fs/promises';
import getAbsolutePath from './getAbsolutePath.js';
import Logger from '../../loggers/logger.service.js';
import { writeFileData } from '../types/types.js';

const logger = new Logger()

const writeFileData = async (newData: writeFileData, Address: string): Promise<boolean> => {
   try {
      const jsonData = JSON.stringify(newData, null, 2);

      await fs.writeFile(getAbsolutePath(Address), [jsonData], 'utf-8');

      logger.log(`writeFileData: successful write in data in ${Address}`);
      return true;
   } catch (error) {
      logger.error(error);
      return false;
   }
};

export default writeFileData;