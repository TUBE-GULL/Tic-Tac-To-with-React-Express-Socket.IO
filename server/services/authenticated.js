import bcrypt from 'bcrypt';
import socketServer from '../app.js';
import tokenService from './cookieTokenServices.js';
import readFileJson from '../modules/readFileJson.js';
import writeFileJson from '../modules/writeFileJson.js';
import tokenGeneration from '../modules/tokenGeneration.js';

const userData = await readFileJson('../data/data.json');

class Authenticated {

   exportUserData(userId) {
      const user = userData.find(el => el.id === userId);
      return {
         id: userId,
         Nickname: user.Nickname,
         time: user.time,
      }
   };

   checkUserFirstsName(formData) {
      return userData.some(el => el.Nickname == formData.Nickname);
   };

   async checkUserDoubleNamePassword(formData) {
      const user = userData.find(el => el.Nickname === formData.Nickname);
      if (user && await bcrypt.compare(formData.password, user.password)) {
         return true;
      }
      return false;
   };

   async checkUser(req, res) {
      const formData = req.body;
      try {
         if (await this.checkUserFirstsName(formData) && await this.checkUserDoubleNamePassword(formData)) {
            console.log('➜ Successful authentication');
            const user = userData.find(el => el.Nickname === formData.Nickname);

            const token = tokenService.generateCookieToken({ id: user.id });
            tokenService.writeCookieData(token.accessToken);

            socketServer.initializeSocketEvents(user);
            res.cookie('authToken', token);
            res.json({ success: true });
         } else {
            res.status(401).json({ success: false, error: 'Wrong login or password !' });
         }
      } catch (error) {
         console.error('Error during sign in:', error);
         res.status(500).json({ success: false, error: 'Internal Server Error' });
      };
   };

   async checkCookie(req, res, authToken) {
      try {
         const user = tokenService.validateAccessToken(authToken);
         socketServer.initializeSocketEvents(this.exportUserData(user.id));
         res.json({ success: true });
      } catch (error) {
         console.error('Token expired:', error);
         res.status(401).json({ success: false, error: 'The token has expired or there is no token' });
      };
   };

   async singIn(req, res) {
      const { authToken } = req.cookies;
      const Cookie = await readFileJson('../data/cookie.json');
      if (authToken && authToken.accessToken && Cookie.includes(authToken.accessToken)) {
         console.log('User authenticated via cookie');
         await this.checkCookie(req, res, authToken.accessToken);
      } else {
         console.log('User authenticated via form');
         await this.checkUser(req, res, Cookie);
      };
   };

   async singUp(req, res) {
      const formData = req.body;
      if (!this.checkUserFirstsName(formData)) {
         const hashedPassword = await bcrypt.hash(formData.password, 10);
         const newUser = {
            id: await tokenGeneration(10),
            Nickname: formData.Nickname,
            password: hashedPassword,
            time: ''
         };
         userData.push(newUser);
         await writeFileJson(userData, '../data/data.json');

         console.log('➜ Successful Registration');
         res.json({ success: true });
      } else {
         console.log('➜ Registration failed');
         res.status(401).json({ success: false, error: 'This user is busy !' });
      }
   };
};

const authenticated = new Authenticated();

export default authenticated;










