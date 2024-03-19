import fs from 'fs/promises';
import getAbsolutePath from './getAbsolutePath.js';
import Logger from '../../loggers/logger.service.js';
// import { UserData } from '../types/types';

const logger = new Logger()

const readFileJson = async (Address: string) => {
   try {
      const Data = await fs.readFile(getAbsolutePath(Address), 'utf-8');
      const DataParse = JSON.parse(Data);
      // console.log(DataParse);
      return DataParse;
   } catch (error) {
      logger.error(error);
      return null;
   };
};

export default readFileJson;

