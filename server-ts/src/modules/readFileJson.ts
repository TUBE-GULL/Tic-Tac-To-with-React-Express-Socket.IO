import fs from 'fs/promises';
import getAbsolutePath from './getAbsolutePath.js';
// import { UserData } from '../types/types';

const readFileJson = async (Address: string) => {
   try {
      const Data = await fs.readFile(getAbsolutePath(Address), 'utf-8');
      const DataParse = JSON.parse(Data);
      // console.log(DataParse);
      return DataParse;
   } catch (error) {
      console.error('error read file data', error);
      return null;
   };
};

export default readFileJson;

