import fs from 'fs/promises';
import getAbsolutePath from './getAbsolutePath.js';


const writeFileData = async (newData) => {
   try {
      const jsonData = JSON.stringify(newData, null, 2);

      await fs.writeFile(getAbsolutePath('../data/data.json'), [jsonData], 'utf-8');

      console.log('Данные успешно записаны в файл: data.json');
      return true;
   } catch (error) {
      console.error('Ошибка при записи данных в файл:', error);
      return false;
   }
}

export default writeFileData;