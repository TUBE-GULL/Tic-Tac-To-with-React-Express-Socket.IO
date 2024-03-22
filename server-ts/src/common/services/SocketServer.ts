import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, socketId } from '../types/types.js';
import logger from '../../loggers/logger.service.js'

class SocketServer {
   io: SocketIOServer;
   usersOnline: Record<string, object>;
   gameRoom: Record<string, object>;
   Logger: logger;

   constructor(httpServer: HttpServer, Logger: logger) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};
      this.gameRoom = {};
      this.Logger = new logger
      this.initializeSocketEvents();
   };

   formDataUser(user: UserData): void {
      this.io.on('connection', (socket: Socket) => {
         this.io.to(socket.id).emit('userFormData', user);
      });
   };

   initializeSocketEvents(): void {

      this.io.on('connection', (socket: Socket) => {
         this.Logger.log('connection: ' + socket.id);

         // send all users list users online
         socket.on('userData', (user: UserData): void => {
            if (!this.isUserOnline(user.id.toString())) {
               this.usersOnline[socket.id] = { socketId: socket.id, Nickname: user.Nickname, Time: user.time };
               this.io.to(socket.id).emit('userData', user);
            }

            this.SendingListUsersEveryone();
         })

         // invitation the Game
         socket.on('invitationGame', (data): void => {
            const userRival = this.searchUser(data.userRival);
            // if (userRival.socketId != undefined) {
            this.io.to((userRival as socketId).socketId).emit('goToGame', { userRival, userSender: this.searchUser(data.userSender) });
            // }
         })

         socket.on('resultInvitationToGame', (data): void => {
            this.Logger.log(data);
            // const userSender = data.usersData.userSender;
            // const userRival = data.usersData.userRival;
            const userSender = { ...data.usersData.userSender, Symbol: 'X', stepGame: true };
            const userRival = { ...data.usersData.userRival, Symbol: 'O', stepGame: false };
            // const room = userRival.socketId + userSender.socketId;

            if (userSender != undefined && userRival != undefined) {

               //result TRUE
               if (data.result) {
                  // this.gameRoom[room] = { userSender, userRival };

                  this.io.to(userRival.socketId).emit('startGame', { stepGame: true, Symbol: 'X', data: { userRival, userSender } });
                  this.io.to(userSender.socketId).emit('startGame', { stepGame: false, Symbol: 'O', users: { userRival, userSender } });

                  //delete list users online
                  this.Logger.log(`join the game ${userRival.socketId} and ${userSender.socketId} `)//room:${room}
                  delete this.usersOnline[userRival.socketId];
                  delete this.usersOnline[userSender.socketId];
                  this.SendingListUsersEveryone();

                  //result False
               } else {
                  this.io.to((userSender as socketId).socketId).emit('rejected', { result: false });
               }
            } else {
               this.Logger.error('userRival or userSearch undefined');
            };


         });

         socket.on('stepGame', ({ sender, data, updatedCells }): void => {
            this.Logger.log('stepGame')
            this.Logger.log(sender)
            // this.Logger.log(data.userSender.Nickname)

            let newStepGameSender, newStepGameRival;

            if (sender === data.userSender.Nickname) {
               newStepGameSender = !data.userSender.stepGame;
               newStepGameRival = !data.userRival.stepGame;
            } else {
               newStepGameSender = !data.userRival.stepGame;
               newStepGameRival = !data.userSender.stepGame;
            }

            let newUserRival = { ...data.userRival, stepGame: newStepGameRival };
            let newUserSender = { ...data.userSender, stepGame: newStepGameSender };

            this.io.to(newUserRival.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newUserRival.stepGame, data });
            this.io.to(newUserSender.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newUserSender.stepGame, data });
            // this.io.to(room).emit('updatedCells', {updatedCells });
         })

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };

   // messages(): {

   // }

   SendingListUsersEveryone(): void {
      this.io.emit('usersOnline', this.usersOnline); // all users
   };

   searchUser(user: UserData): object | undefined {
      return Object.values(this.usersOnline).find(userObj =>
         (userObj as UserData).id === user.id || (userObj as UserData).Nickname === user.Nickname
      );
   };

   isUserOnline(userId: string): boolean {
      const value = Object.values(this.usersOnline);
      for (const userObj of value) {
         if ((userObj as UserData).id == userId) {
            return true;
         }
      };
      return false;
   };

   disconnect(socket: Socket): void {
      this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.SendingListUsersEveryone();
   };
};

export default SocketServer;

// const startTimerForRoom = (io, roomTimers, roomName) => {
//    const roomTimerInterval = setInterval(() => {
//       const currentTime = timerForGame(roomTimers, roomName);
//       io.to(roomName).emit('timerUpdate', { time: currentTime });
//    }, 10);
// };

const checkWin = (cells) => {
   const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные
      [0, 4, 8], [2, 4, 6]             // Диагональные
   ];

   return winPatterns.some(pattern =>
      cells[pattern[0]] !== '' &&
      cells[pattern[0]] === cells[pattern[1]] &&
      cells[pattern[1]] === cells[pattern[2]]
   );
};

// //тут проверка все значений по правилом хо
// // data.data.updatedCells

// const newStepGameRival = !data.users.userRival.stepGame;
// const newStepGameSender = !data.users.userSender.stepGame;

// const newUserRival = { ...data.users.userRival, stepGame: newStepGameRival };
// const newUserSender = { ...data.users.userSender, stepGame: newStepGameSender };

// // this.io.to((data.users.userRival as socketId).socketId).emit('updateCells', { Cells: updatedCells, user: newUserRival, users: data.users });
// // this.io.to((data.users.userSender as socketId).socketId).emit('updateCells', { Cells: updatedCells, user: newUserSender, users: data.users });

// // this.Logger.log()
// if (data.user.Nickname == data.users.userRival.Nickname) {

//    this.io.to((data.users.userRival as socketId).socketId).emit('updateCells', { Cells: updatedCells, user: newUserRival, users: data.users });
//    this.io.to((data.users.userSender as socketId).socketId).emit('updateCells', { Cells: updatedCells, user: newUserSender, users: data.users });

// } else {
//    this.io.to((data.users.userRival as socketId).socketId).emit('updateCells', { Cells: updatedCells, user: newUserRival, users: data.users });
//    this.io.to((data.users.userSender as socketId).socketId).emit('updateCells', { Cells: updatedCells, user: newUserSender, users: data.users });

// }
// // this.io.to((data.data.userRival as socketId).socketId).emit('updateCells', { Cells: updatedCells, data });

// // this.io.to((data.data.userSender as socketId).socketId).emit('updateCells', { Cells: updatedCells, data });
