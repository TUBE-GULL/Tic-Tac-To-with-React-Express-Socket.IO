import fs from 'fs/promises';
import getAbsolutePath from './getAbsolutePath.js';

const readFileJson = async (Address: string): Promise<any | null> => {
   try {
      const Data = await fs.readFile(getAbsolutePath(Address), 'utf-8');
      const usersData = JSON.parse(Data);
      // console.log(usersData);
      return usersData;
   } catch (error) {
      console.error('error read file data', error);
      return null;
   };
};

export default readFileJson;

