import crypto from 'crypto';
import { readFileData } from './readFileData.js';

// const tokenGeneration = (bit) => { // ушел в бесконечный цикл когда data 0
//    // let token = crypto.randomBytes(bit).toString('hex')
//    let token;

//    do {
//       token = crypto.randomBytes(bit).toString('hex');
//    } while (data.every(el => el.token === token));

//    return token;
// }

const tokenGeneration = async (bit) => {
   const data = await readFileData()
   let token = crypto.randomBytes(bit).toString('hex')
   // console.log(data)
   if (data.every(el => el.token == token)) {
      token = crypto.randomBytes(bit).toString('hex')
   }
   return token
}

export { tokenGeneration };
