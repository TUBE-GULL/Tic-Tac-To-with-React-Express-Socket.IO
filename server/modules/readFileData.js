import fs from 'fs/promises';
import { getAbsolutePath } from '../modules/getAbsolutePath.js';

const readFileData = async () => {
   try {
      const Data = await fs.readFile(getAbsolutePath('../data/data.json'), 'utf-8');
      const usersData = JSON.parse(Data);
      // console.log(usersData);
      return usersData;
   } catch (error) {
      console.error('error read file data', error);
      return null;
   };
};

export { readFileData };