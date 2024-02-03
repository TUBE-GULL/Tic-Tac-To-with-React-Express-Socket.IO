import crypto from 'crypto';
import readFileJson from './readFileJson.js';

const tokenGeneration = async (bit) => {
   const data = await readFileJson('../data/data.json')
   let token = crypto.randomBytes(bit).toString('hex')
   // console.log(data)
   if (data.every(el => el.token == token)) {
      token = crypto.randomBytes(bit).toString('hex')
   }
   return token
}

export default tokenGeneration;
