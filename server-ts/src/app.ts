import * as http from 'http';
import express, { Express } from 'express';
import { Server } from 'http'
import router from './routes/router.js';
import MyLogo from './loggers/My-Logo.js';
import SocketServer from './common/services/SocketServer.js';
import logger from './loggers/logger.service.js';
import Authenticated from './common/services/authenticated.js';

class App {
   app: Express;
   server: Server;
   PORT: string | number;
   Logger: logger;
   socketServer: SocketServer;

   constructor(Logger: logger) {
      this.app = express();
      this.server = http.createServer(this.app);
      this.PORT = process.env.PORT || 8080;
      this.Logger = new logger();
      this.socketServer = new SocketServer(this.server, this.Logger);
   };

   Routes() {
      this.app.use('/', router);
   };

   startServer(): void {
      this.server.listen(this.PORT, () => {
         MyLogo();
         console.log(` ➜  Local: \x1b[32m\x1b[4mhttp://localhost:${this.PORT}/\x1b[0m`);
         console.timeEnd(' ➜  \x1b[32mServer startup time\x1b[0m');
      })
   };

   public async start() {
      console.time(' ➜  \x1b[32mServer startup time\x1b[0m');

      this.Routes();
      this.startServer();
   };
};
const Logger = new logger();
const APP = new App(Logger);
const authenticated = new Authenticated(APP.socketServer, Logger)


export { APP, authenticated };

// this.SocketServer();
// SocketServer(): void {
//    const socketServer = new SocketServer(this.server, this.Logger);
// }

// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 8080;

// app.use('/', router);

// const socketServer = new SocketServer(server);


// console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');
// server.listen(PORT, () => {
//    logs();
//    console.log(` ➜ \x1b[32mLocal: \x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
//    console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
// });

// export default socketServer;