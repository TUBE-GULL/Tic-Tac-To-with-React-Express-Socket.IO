import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import APP from '../../app.js';
import SocketServer from './SocketServer.js';
import tokenService from './cookieTokenServices.js';
import Logger from '../../loggers/logger.service.js';
import readFileJson from '../modules/readFileJson.js';
import { UserData, FormData } from '../types/types.js';
import writeFileJson from '../modules/writeFileJson.js';
import tokenGeneration from '../modules/tokenGeneration.js';

const userData = await readFileJson('../data/data.json');

class Authenticated {
   SocketServer: SocketServer;
   // app: App;
   logger: Logger;

   constructor(SocketServer: SocketServer, Logger: Logger) {
      // this.SocketServer = socketServer;
      this.logger = Logger;
      this.SocketServer = SocketServer;
   }

   exportUserData(userId: number): UserData {

      const user = userData.find((el: UserData) => el.id === userId);

      return {
         id: userId,
         Nickname: user.Nickname,
         time: user.time,
      }
   };

   checkUserFirstsName(formData: FormData): boolean {
      return userData.some((el: UserData) => el.Nickname == formData.Nickname);
   };

   async checkUserDoubleNamePassword(formData: FormData) {

      const user = userData.find((el: UserData) => el.Nickname === formData.Nickname);

      if (user && await bcrypt.compare(formData.password, user.password)) {
         return true;
      }
      return false;
   };

   async checkUser(req: Request, res: Response) {
      const formData = req.body;
      try {
         if (await this.checkUserFirstsName(formData) && await this.checkUserDoubleNamePassword(formData)) {
            console.log('➜ Successful authentication');

            const user = userData.find((el: UserData) => el.Nickname === formData.Nickname);

            const token = tokenService.generateCookieToken({ id: user.id });
            tokenService.writeCookieData(token.accessToken);//     ?

            this.SocketServer.initializeSocketEvents(user);
            res.cookie('authToken', token);
            res.json({ success: true });
         } else {
            res.status(401).json({ success: false, error: 'Wrong login or password !' });
         }
      } catch (error) {
         this.logger.error(error);
         res.status(500).json({ success: false, error: 'Internal Server Error' });
      };
   };

   async checkCookie(req: Request, res: Response, authToken: string) {
      try {
         const user = tokenService.validateAccessToken(authToken);
         this.logger.log(user)
         // this.SocketServer.initializeSocketEvents(this.exportUserData(user.id));
         res.json({ success: true });
      } catch (error) {
         this.logger.error(error);
         res.status(401).json({ success: false, error: 'The token has expired or there is no token' });
      };
   };

   async singIn(req: Request, res: Response) {
      const { authToken } = req.cookies;
      const Cookie = await readFileJson('../data/cookie.json');
      if (authToken && authToken.accessToken && Cookie.includes(authToken.accessToken)) {
         console.log('User authenticated via cookie');
         await this.checkCookie(req, res, authToken.accessToken);
      } else {
         console.log('User authenticated via form');
         await this.checkUser(req, res);
      };
   };

   async singUp(req: Request, res: Response) {
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

         this.logger.log('➜ Successful Registration');
         res.json({ success: true });
      } else {
         this.logger.log('➜ Registration failed');
         res.status(401).json({ success: false, error: 'This user is busy !' });
      }
   };
};

const logger = new Logger();
const socketServer = new SocketServer(APP.server, logger);

const authenticated = new Authenticated(socketServer, logger)


export default authenticated;
