import * as http from 'http';
import express, { Express } from 'express';
import MyLogo from './loggers/My-Logo';
import { Server } from 'http'
import router from './routes/router';
import SocketServer from './services/SocketServer';
import logger from './loggers/logger.service';

export class App {
   app: Express;
   server: Server;
   PORT: string | number;;
   Logger: logger;

   constructor(Logger: logger) {
      this.app = express();
      this.server = http.createServer(this.app);
      this.PORT = process.env.PORT || 8080;
      this.Logger = new logger();
   }

   Routes() {
      this.app.use('/', router)
   }

   SocketServer(): void {
      const socketServer = new SocketServer(this.server);
   }

   startServer(): void {
      this.server.listen(this.PORT, () => {
         MyLogo();
         this.Logger.log(`\x1b[32mLocal: \x1b[4mhttp://localhost:${this.PORT}/\x1b[0m`);
         console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
      })
   }

   public async start() {
      console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');

      this.SocketServer();
      this.Routes();
      this.startServer();
   }
};

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