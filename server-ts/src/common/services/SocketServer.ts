import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, GameRoom, sendMessage, CheckWinFunction, UsersOnline, UserOnline, UserGame } from '../types/types.js';
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
      // this.Logger.log('formDataUser');
      this.Logger.log(user);
      this.io.on('connection', (socket: Socket) => {
         this.Logger.log(user);

         this.io.to(socket.id).emit('userFormData', user);
      });
   };

   //main function
   initializeSocketEvents(): void {
      // this.Logger.log('connection: ' + socket.id);
      this.io.on('connection', (socket: Socket) => {

         //send in client data 
         socket.on('userData', (user: UserData): void => {
            const userId = user.id;
            if (!this.checkUserOnline(userId)) {
               const userOnline: UserOnline = {
                  socketId: socket.id,
                  id: user.id,
                  Nickname: user.Nickname,
                  Time: user.time,
                  invitation: true
               }
               this.usersOnline[userId] = userOnline;
               this.sendAllModifiedListUserOnline();
            } else {
               // add function send sing in 
               this.Logger.log('connection: undefined');
               this.io.to(socket.id).emit('resetSingIn');
            }
         });

         // chat 
         socket.on('sendMessage', (message: sendMessage): void => {
            this.io.emit('sendEveryoneMessage', message);
         });

         //V1  first part functions for game
         socket.on('invitationGame', ({ userSender, userRival }): void => {
            // this.Logger.log(this.usersOnline)

            // remove the user from invitation access
            if (!this.searchUser(userRival) && !this.searchUser(userSender)) {
               this.io.to(userSender.socketId).emit('invitationUser', true);
               return
            };

            const Sender: UserOnline | undefined = this.searchUser(userSender);
            const Rival: UserOnline | undefined = this.searchUser(userRival);

            // if (Sender !== undefined && Rival === undefined) {
            //    /// ADD
            //    this.io.to(Sender.socketId).emit('invitationUser', true);
            // };
            // if (Sender === undefined && Rival !== undefined) {
            //    /// ADD
            //    this.io.to(Rival.socketId).emit('invitationUser', true);
            // };

            if (Sender && Rival) {
               if (userSender.invitation) {
                  this.usersOnline[Sender.socketId].invitation = false;
                  this.usersOnline[Rival.socketId].invitation = false;
               }
               this.io.to(Rival.socketId).emit('goToGame', { Rival, Sender })
            } else {
               if (Sender) {
                  this.io.to(Sender.socketId).emit('invitationUser', false);
               };
            };
         });

         //V2 second part function for game 
         socket.on('resultInvitationToGame', ({ result, usersData }): void => {
            this.Logger.log(usersData);

            const Sender: UserGame = {
               ...usersData.Sender,
               Symbol: 'X',
               stepGame: true
            };
            const Rival: UserGame = {
               ...usersData.Rival,
               Symbol: 'O',
               stepGame: false
            };

            if (Sender != undefined && Rival != undefined) {

               //result True
               if (result) {
                  const roomId = Sender.socketId + Rival.socketId;
                  const newGameRoom: GameRoom = {
                     Sender: Sender.socketId,
                     Rival: Rival.socketId,
                     timerInterval: null,
                     timerValue: '',
                  };


                  this.gameRooms[roomId] = newGameRoom;
                  this.io.to(Rival.socketId).emit('startGame', { stepGame: true, Symbol, data: { Sender, Rival, roomId } })
                  this.io.to(Sender.socketId).emit('startGame', { stepGame: true, Symbol, data: { Sender, Rival, roomId } })
                  this.sendTimeRoom(roomId);

                  //delete list users online
                  delete this.usersOnline[Rival.id];
                  delete this.usersOnline[Sender.id];
                  this.sendAllModifiedListUserOnline();

                  //result false
               }
            } else {
               this.Logger.error('userRival or userSearch undefined');
               // !!!!
               if (Sender !== undefined && Rival === undefined) {
                  /// ADD
                  this.io.to(Sender.socketId).emit('invitationUser', true);
               };
               if (Sender === undefined && Rival !== undefined) {
                  /// ADD
                  this.io.to(Rival.socketId).emit('invitationUser', true);
               };
            }
         })

         socket.on('stepGame', ({ sender, data, updatedCells }): void => {
         });


         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };


   // private searchUser(user: UserOnline): UserOnline {

   // }


   // mailing to everyone  about adding/removing  a new user
   private sendAllModifiedListUserOnline(): void {
      this.io.emit('usersOnline', this.usersOnline); // all users
   };


   private checkUserOnline(userId: string | number): boolean {
      const users = Object.values(this.usersOnline);

      for (let user of users) {
         if (typeof userId === 'string' && user.id === userId) {
            return true;
         }
         if (typeof userId === 'number' && user.id === userId) {
            return true;
         };
      };
      return false;
   };

   private searchUser(data: { Nickname?: string, socketId?: string, }): UserOnline | undefined {
      const users = Object.values(this.usersOnline);

      if (data.Nickname !== undefined) {
         return users.find(user => user.Nickname === data.Nickname);
      }
      if (data.socketId !== undefined) {
         return users.find(user => user.socketId === data.socketId);
      }

      return undefined
   };


   private sendTimeRoom(gameRoom: string): void {
      const room = this.gameRooms[gameRoom];
      if (room && room.timerInterval) {
         clearInterval(room.timerInterval);
      }
      if (room) {
         room.timerInterval = setInterval(() => {
            const timeString = timerForGame();

            room.timerValue = timeString;
            this.io.to(room.Rival).emit('timerUpdate', timeString);
            this.io.to(room.Sender).emit('timerUpdate', timeString);
         }, 100);
      }
   }

   private stopTimeRoom(gameRoom: string): void {
      // this.Logger.log('timer stop');
      const room = this.gameRooms[gameRoom];
      if (room && room.timerInterval) {
         clearInterval(room.timerInterval);
         // return room.timerInterval
         room.timerInterval = null;
      }
   }

   // private searchUser(socketId: string): string | undefined {
   //    const user = Object.values(this.usersOnline).find(user => user.socketId === socketId)
   //    return user ? user.Nickname : undefined;
   // };

   private disconnect(socket: Socket): void {
      const disconnectUser = this.searchUser({ socketId: socket.id });
      this.Logger.log('User disconnected: ' + socket.id);

      if (disconnectUser) {
         delete this.usersOnline[disconnectUser.id];
         this.sendAllModifiedListUserOnline();
      };

      // this.leaveRoomGame(socket.id, this.gameRooms)
   };
};

export default SocketServer;




