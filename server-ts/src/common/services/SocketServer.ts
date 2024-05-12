import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, GameRoom, sendMessage, CheckWinFunction, UsersOnline, UserOnline } from '../types/types.js';
import checkWin from '../modules/gameFun.js';
import logger from '../../loggers/logger.service.js'
import timerForGame from '../modules/timerForGame.js';
import writeFileData from '../modules/writeFileJson.js';
import readFileJson from '../modules/readFileJson.js'

class SocketServer {
   io: SocketIOServer;
   usersOnline: UsersOnline;
   gameRooms: Record<string, GameRoom>;
   Logger: logger;
   checkWin: CheckWinFunction;

   constructor(httpServer: HttpServer, Logger: logger, checkWin: CheckWinFunction) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};
      this.gameRooms = {};
      this.Logger = new logger
      this.checkWin = checkWin;
      this.initializeSocketEvents();
   };

   // my crutch function for send in socket data from express 🫠
   formDataUser(user: UserData): void {
      this.io.on('connection', (socket: Socket) => {
         this.io.to(socket.id).emit('userFormData', user);
      });
   };

   //main function
   initializeSocketEvents(): void {
      this.io.on('connection', (socket: Socket) => {

         //send in client data 
         socket.on('userData', (user: UserData): void => {
            if (!this.checkUserOnline(user.id.toString())) {
               const userOnline: UserOnline = {
                  socketId: socket.id,
                  Nickname: user.Nickname,
                  Time: user.time,
                  invitation: true
               }
               this.usersOnline[socket.id] = userOnline;
               this.sendAllModifiedListUserOnline();
            } else {
               // add function send sing in 
               this.io.emit('resetSingIn');
            }
         });

         // chat 
         socket.on('sendMessage', (message: sendMessage): void => {
            this.io.emit('sendEveryoneMessage', message);
         });

         //main functions for game
         socket.on('invitationGame', (data): void => {

         })
         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };


   private sendAllModifiedListUserOnline(): void {
      this.io.emit('usersOnline', this.usersOnline); // all users
   };

   private checkUserOnline(userId: string): boolean {
      const users = Object.values(this.usersOnline);

      for (const userObj of users) {
         if ('id' in userObj && userObj.id === userId) {
            return true;
         }
      }

      return false;
   };

   private disconnect(socket: Socket): void {
      // this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.sendAllModifiedListUserOnline();
      // this.leaveRoomGame(socket.id, this.gameRooms)
   };
};

export default SocketServer;



