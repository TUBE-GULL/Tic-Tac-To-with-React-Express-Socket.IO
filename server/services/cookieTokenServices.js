import writeFileJson from '../modules/writeFileJson.js';


const config = await readFileJson('./config.json');
const Cookie = await readFileJson('../data/cookie.json');

class TokenService {
   generateCookieToken(useData) {
      const accessToken = jwt.sign(useData, config.secretKey, { expiresIn: '1day' });
      // const refreshToken = jwt.sign(useData, config.RefreshSecretKey, { expiresIn: '14day' });

      return { accessToken };//, refreshToken 
   };

   validateAccessToken(token) {
      try {
         const userData = jwt.verify(token, config.secretKey);

         return userData;
      } catch (e) {
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

   async writeCookieData(token) {
      //!
      Cookie.push(token);
      await writeFileJson(Cookie, '../data/cookie.json');
   }




};

const tokenService = new TokenService;

export default tokenService;