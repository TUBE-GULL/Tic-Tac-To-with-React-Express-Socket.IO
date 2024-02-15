import fs from 'fs/promises';
import getAbsolutePath from './getAbsolutePath.js';


const writeFileData = async (newData, Address) => {
   try {
      const jsonData = JSON.stringify(newData, null, 2);

      await fs.writeFile(getAbsolutePath(Address), [jsonData], 'utf-8');

      console.log(`successful write in data in ${Address}`);
      return true;
   } catch (error) {
      console.error('ERROR write in data:', error);
      return false;
   }
}

export default writeFileData;