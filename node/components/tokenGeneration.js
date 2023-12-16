import crypto from 'crypto';
import data from '../../data/data.js';

// const tokenGeneration = (bit) => { // ушел в бесконечный цикл когда data 0
//    // let token = crypto.randomBytes(bit).toString('hex')
//    let token;

//    do {
//       token = crypto.randomBytes(bit).toString('hex');
//    } while (data.every(el => el.token === token));

//    return token;
// }

const tokenGeneration = (bit) => {
   let token = crypto.randomBytes(bit).toString('hex')

   if (data.every(el => el.token == token)) {
      token = crypto.randomBytes(bit).toString('hex')
   }
   return token
}

export default tokenGeneration;
