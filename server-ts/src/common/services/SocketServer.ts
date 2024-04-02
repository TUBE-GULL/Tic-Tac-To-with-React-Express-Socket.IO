import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, socketId, GameRoom } from '../types/types.js';
import logger from '../../loggers/logger.service.js'

class SocketServer {
   io: SocketIOServer;
   usersOnline: Record<string, object>;
   gameRooms: Record<string, object>;
   Logger: logger;

   constructor(httpServer: HttpServer, Logger: logger) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};
      this.gameRooms = {};
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
            const userSender = { ...data.usersData.userSender, Symbol: 'X', stepGame: true };
            const userRival = { ...data.usersData.userRival, Symbol: 'O', stepGame: false };

            if (userSender != undefined && userRival != undefined) {

               const newGameRoom: GameRoom = {
                  userSender: userSender.socketId,
                  userRival: userRival.socketId
               };

               this.gameRooms[userSender.socketId + userRival.socketId] = newGameRoom;

               //result TRUE
               if (data.result) {

                  this.io.to(userRival.socketId).emit('startGame', { stepGame: true, Symbol: 'X', data: { userRival, userSender } });
                  this.io.to(userSender.socketId).emit('startGame', { stepGame: false, Symbol: 'O', users: { userRival, userSender } });

                  //delete list users online
                  // this.Logger.log(`join the game ${userRival.socketId} and ${userSender.socketId} `)//room:${room} ???

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
            let newStepGameSender, newStepGameRival;

            this.Logger.log(updatedCells)
            if (sender.Nickname === data.userSender.Nickname) {
               newStepGameSender = !data.userSender.stepGame;
               newStepGameRival = !data.userRival.stepGame;
            } else {
               newStepGameSender = !data.userRival.stepGame;
               newStepGameRival = !data.userSender.stepGame;
            };
            let newUserRival = { ...data.userRival, stepGame: newStepGameRival };
            let newUserSender = { ...data.userSender, stepGame: newStepGameSender };

            //check uses on victory
            if (checkWin(updatedCells)) {
               const isSenderWinner = sender.symbol === data.userSender.Symbol;
               this.io.to(data.userSender.socketId).emit('gameResult', { Cells: updatedCells, isWinner: !isSenderWinner });
               this.io.to(data.userRival.socketId).emit('gameResult', { Cells: updatedCells, isWinner: isSenderWinner });
               delete this.gameRooms[data.userSender.socketId + data.userRival.socketId];
               this.returnUserList(data.userRival, data.userSender);
            } else if (updatedCells.every((el: string) => el !== '')) {
               this.io.to(data.userSender.socketId).emit('gameResult', { Cells: updatedCells, isWinner: 'nobody' });
               this.io.to(data.userRival.socketId).emit('gameResult', { Cells: updatedCells, isWinner: 'nobody' });
               delete this.gameRooms[data.userSender.socketId + data.userRival.socketId];
               this.returnUserList(data.userRival, data.userSender);
            } else {
               this.io.to(newUserRival.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newUserRival.stepGame, data });
               this.io.to(newUserSender.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newUserSender.stepGame, data });
            }
         });

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

   returnUserList = (userRival: socketId, userSender: socketId): void => {
      this.usersOnline[userRival.socketId] = userRival;
      this.usersOnline[userSender.socketId] = userSender;

      this.SendingListUsersEveryone();
   }

   leaveRoomGame = (socketId: string, gameRooms: object): void => {
      if (gameRooms) {
         for (const room of Object.values(gameRooms)) {
            if (room.userRival === socketId) {
               this.io.to(room.userSender).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               delete this.gameRooms[room.userSender + room.userRival];
               this.SendingListUsersEveryone();
            } else if (room.userSender === socketId) {
               this.io.to(room.userRival).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               delete this.gameRooms[room.userSender + room.userRival];
               this.SendingListUsersEveryone();
            }
         }
      };
   };

   disconnect(socket: Socket): void {
      this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.SendingListUsersEveryone();
      this.leaveRoomGame(socket.id, this.gameRooms)
   };
};

export default SocketServer;



const checkWin = (cells: string[]): boolean => {
   const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
      [0, 4, 8], [2, 4, 6]             // Diagonal
   ];

   return winPatterns.some(pattern =>
      cells[pattern[0]] !== '' &&
      cells[pattern[0]] === cells[pattern[1]] &&
      cells[pattern[1]] === cells[pattern[2]]
   );
};



// if (gameRooms) {
// for (const room of Object.values(gameRooms)) {
// if (room.userRival.socketId === socketId) {
// this.io.to(room.userSender.socketId).emit('opponentRanAway', { message: 'Opponent Ran Away' });
// delete this.usersOnline[room];
// this.SendingListUsersEveryone();
// } else if (room.userSender.socketId === socketId) {
// this.io.to(room.userRival.socketId).emit('opponentRanAway', { message: 'Opponent Ran Away' });
// delete this.usersOnline[room];
// this.SendingListUsersEveryone();
// }
// }
// };

//    if (userRival) {
//       this.io.to(userRival.socketId).emit('gameCancelled', { message: 'User has left the game' });
//       this.Logger.log(userRival)
//       this.usersOnline[socket.id] = { socketId: socket.id, Nickname: userRival.Nickname, Time: userRival.time };
//       this.SendingListUsersEveryone();
//    }
//    if (userSender) {
//       this.Logger.log(userSender)
//       this.io.to(userSender.socketId).emit('gameCancelled', { message: 'User has left the game' });
//       this.usersOnline[socket.id] = { socketId: socket.id, Nickname: userSender.Nickname, Time: userSender.time };
//       this.SendingListUsersEveryone();

//    }
// });

// const startTimerForRoom = (io, roomTimers, roomName) => {
//    const roomTimerInterval = setInterval(() => {
//       const currentTime = timerForGame(roomTimers, roomName);
//       io.to(roomName).emit('timerUpdate', { time: currentTime });
//    }, 10);
// };



// this.Logger.log(socketId)
// this.Logger.log(room.userRival.socketId)
// this.Logger.log(room.userSender.socketId)

// this.usersOnline[room.userRival.socketId] = { socketId, Nickname: room.userRival.Nickname, Time: room.userRival.Time };


// this.Logger.log(socketId)
// this.Logger.log(room.userRival.socketId)
// this.Logger.log(room.userSender.socketId)
// this.usersOnline[room.userSender.socketId] = { socketId, Nickname: room.userSender.Nickname, Time: room.userSender.Time };


// this.usersOnline[userRival.socketId] = { socketId: userRival.socketId, Nickname: userRival.Nickname, Time: userRival.Time };
// this.usersOnline[userSender.socketId] = { socketId: userSender.socketId, Nickname: userSender.Nickname, Time: userRival.Time };
// this.SendingListUsersEveryone();
// this.Logger.log(this.usersOnline)

// this.usersOnline[userRival.socketId] = { socketId: userRival.socketId, Nickname: userRival.Nickname, Time: userRival.Time };
// this.usersOnline[userSender.socketId] = { socketId: userSender.socketId, Nickname: userSender.Nickname, Time: userRival.Time };
// this.SendingListUsersEveryone();
// this.Logger.log(this.usersOnline)