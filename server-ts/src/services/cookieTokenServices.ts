import jwt from 'jsonwebtoken';

import writeFileJson from '../modules/writeFileJson.js';
import readFileJson from '../modules/readFileJson.js';

const config = await readFileJson('./config.json');
const Cookie = await readFileJson('../data/cookie.json');


class TokenService {
   generateCookieToken(useData: object): object {
      const accessToken = jwt.sign(useData, config.secretKey, { expiresIn: '1day' });
      // const refreshToken = jwt.sign(useData, config.RefreshSecretKey, { expiresIn: '14day' });

      return { accessToken };//, refreshToken 
   };

   validateAccessToken(token: string) {
      try {
         const userData = jwt.verify(token, config.secretKey);

         // console.log('Token verified successfully:', userData);
         return userData;
      } catch (e) {
         console.error('Token verification failed:', e);
         return null;
      }
   };

   // validateRefreshToken(token) {
   //    try {
   //       const userData = jwt.verify(token, config.RefreshSecretKey);

   //       return userData;
   //    } catch (e) {
   //       return null;
   //    }

   // };

   async writeCookieData(token: string) {
      //!
      Cookie.push(token);
      await writeFileJson(Cookie, '../data/cookie.json');
   }
};

const tokenService = new TokenService;

export default tokenService;