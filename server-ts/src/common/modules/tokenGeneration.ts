import crypto from 'crypto';
import readFileJson from './readFileJson.js';

const tokenGeneration = async (bit: number): Promise<string> => {
   const data = await readFileJson('../data/data.json')
   let id: string = crypto.randomBytes(bit).toString('hex')
   if (data.every((el: any) => el.id == id)) {
      id = crypto.randomBytes(bit).toString('hex')
   }
   return id
}

export default tokenGeneration;
