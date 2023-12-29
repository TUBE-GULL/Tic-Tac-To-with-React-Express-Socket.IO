
import { Server } from 'socket.io';
import startTimerForRoom from './module/startTimerForRoom.js';

// const server = http.createServer();
// const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.on('connection', (socket) => {
   // проверяет на наличия похожего профеля в сети 
   const existingUser = activeUsers[socket.id];

   if (!existingUser) {
      activeUsers[socket.id] = {
         name: user.name,
         time: user.timer,
         socketId: socket.id
      };

      socket.emit('userData', { user, socketId: socket.id });
      io.emit('activeUsers', activeUsers);
   }
   socket.on('buttonClick', ({ senderName, senderSocketId, receiverName, receiverSocketId, senderTime }) => {
      // console.log({ senderName, senderSocketId, receiverName, receiverSocketId })
      if (senderSocketId !== receiverSocketId) {
         // && senderSocketId !== undefined // бывает чо видно undefined надо чтобы выбрасывало в singin 
         io.to(receiverSocketId).emit('confirm', { senderName, senderSocketId, receiverName, receiverSocketId, senderTime })
      }
   })

   socket.on('reject', ({ senderSocketId, receiverName }) => {
      io.to(senderSocketId).emit('refusalAlert', { receiverName });
   });

   socket.on('confirmTrue', ({ senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime }) => {
      // Проверка валидности сокетов
      const validSockets = senderSocketId && receiverSocketId &&
         io.sockets.sockets.has(senderSocketId) &&
         io.sockets.sockets.has(receiverSocketId);

      if (validSockets) {

         const roomForGame = `room_${senderSocketId}_${receiverSocketId}`;

         // проверка на повтор комнаты 
         const userAlreadyInRoom = Object.values(activeRooms).some(room => {
            return room.senderSocketId === senderSocketId || room.receiverSocketId === senderSocketId;
         });


         if (!userAlreadyInRoom) {
            io.sockets.sockets.get(senderSocketId).join(roomForGame);
            io.sockets.sockets.get(receiverSocketId).join(roomForGame);

            activeRooms[roomForGame] = {
               senderName,
               senderSocketId,
               receiverName,
               receiverSocketId,
               senderTime,
               receiverTime
            };

            io.to(senderSocketId).emit('confirmed', { senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime });
            io.to(receiverSocketId).emit('confirmed', { senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime });
            console.log(`Пользователи ${senderName} и ${receiverName} переведены в комнату ${roomForGame}`);

            startTimerForRoom(io, roomTimers, roomForGame);

            let roomTimerInterval;
            roomTimers[roomForGame] = roomTimerInterval;

            // Удаление данных пользователей из комнаты 
            delete activeUsers[senderSocketId];
            delete activeUsers[receiverSocketId];

            // отправляет все пользователя на перерисовку страницы 
            io.emit('activeUsers', activeUsers);

            // game +++++++++++++++++++++++++++++++++++++++++++++++

            // 1) сделать передачу заняых клеток на сервере будет хранитсья массив с данными о занятых клетках
            // 2) пользователь при нажатии на кледку отправляет данные о том что он занял ячейку и отправляет номер ячейки и символ
            // 3)

            socket.on('startGame', (gameData) => {
               console.log(gameData.senderSocketId)
               console.log(gameData.receiverSocketId)

               const users = [
                  {
                     oneUserName: gameData.senderName,
                     UserSocketId: gameData.senderSocketId,
                     offNo: true,
                     Symbol
                  },
                  {
                     twoUserName: gameData.receiverName,
                     UserSocketId: gameData.receiverSocketId,
                     offNo: false,
                     Symbol
                  }
               ];
               // const randomTicTacToe = getRandomTicTacToe() добавить рандомное появления x o

               users[0].Symbol = 'X';
               users[1].Symbol = 'O';

               // тут отправляю данные всем игракам 
               io.to(users[0].UserSocketId).emit('start', { users, user: users[0] });
               io.to(users[1].UserSocketId).emit('start', { users, user: users[1] });
            });


            // socket.on('clickCell', (userData) => {
            //    console.log(userData);
            // });

            socket.on('clickCell', ({ usersData, cellData }) => {
               console.log('click');

               // console.log(usersData[0].offNo)
               // console.log(usersData[1].offNo)

               usersData[0].offNo = !usersData[0].offNo;
               usersData[1].offNo = !usersData[1].offNo;

               console.log(usersData[0].UserSocketId);
               console.log(usersData[1].UserSocketId);

               const dataFieldGames = ['', '', '', '', '', '', '', '', ''];

               const index = cellData.index;
               dataFieldGames[index] = cellData.content;

               io.to(usersData[0].UserSocketId).emit('updateGameField', { dataFieldGames, user: usersData[0] });
               io.to(usersData[1].UserSocketId).emit('updateGameField', { dataFieldGames, user: usersData[1] });
               // io.to(usersData[0].oneUserSocketId).emit('Games', { users: usersData, user: usersData[0] });
               // io.to(usersData[1].twoUserSocketId).emit('Games', { users: usersData, user: usersData[1] });
            });

            // socket.on('startGame', (gameData) => {
            //    const users = [
            //       {
            //          oneUserName: gameData.senderName,
            //          oneUserSocketId: gameData.senderSocketId,
            //          offNo: true,
            //       },
            //       {
            //          twoUserName: gameData.senderName,
            //          twoUserSocketId: gameData.receiverSocketId,
            //          offNo: false,
            //       }
            //    ]
            //    // const randomTicTacToe = getRandomTicTacToe() добавить рандомное появления x o 

            //    const xSymbol = 'x';
            //    const oSymbol = 'o';

            //    io.to(users[0].oneUserSocketId).emit('Games', { symbol: xSymbol, offNo: users[0].offNo, users });
            //    io.to(users[1].twoUserSocketId).emit('Games', { symbol: oSymbol, offNo: users[1].offNo, users });

            //    // io.to(roomForGame).emit('Games', { randomTicTacToe });
            // })

            // socket.on('clickCell', (data, users) => {
            //    const dataFieldGames = [] // 9 

            //    const index = data.index;
            //    dataFieldGames[index] = data.content;

            //    io.to(users[0].oneUserSocketId).emit('updateGame', { dataFieldGames, offNo: users[0].offNo });
            //    io.to(users[1].twoUserSocketId).emit('updateGame', { dataFieldGames, offNo: users[1].offNo });
            //    // io.to(users[0].oneUserSocketId).emit('Games', { offNo: users[0].offNo, users });
            //    // io.to(users[1].twoUserSocketId).emit('Games', { offNo: users[1].offNo, users });
            // });

            // function games +++++++++++++++++++++++++++++++++++++++++++++++

            const getRandomTicTacToe = () => {
               const values = ['X', 'O'];
               const randomIndex = Math.floor(Math.random() * values.length);
               return values[randomIndex];
            };

            const checkWin = () => {
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

            const checkDraw = () => {
               return cells.every(cell => cell !== '');
            };

            const resetGame = () => {
               cells.fill('');
               currentPlayer = 'X';
               io.emit('updateBoard', { cells, currentPlayer });
            };
         } else {
            console.log(`Пользователи ${senderName} и ${receiverName} уже находятся в комнате ${roomForGame}`);
         };
      } else {
         console.log('Невалидные сокеты');
      };
   });

   socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      delete activeUsers[socket.id];
      io.emit('activeUsers', activeUsers);
   });
});


class SocketGame {
   constructor(io) {
      this.io = io;
      this.activeUsers = {};
      this.activeRooms = {};
      this.roomTimers = {};
      this.initializeSocket();
   }

   initializeSocket() {
      this.io.on('connection', (socket) => {
         this.gameConnection(socket);
         this.gameButtonClick(socket);
         this.gameReject(socket);
         this.gameConfirmTrue(socket);
         this.gameDisconnect(socket);
         // Другие обработчики событий...
      });
   }

   gameConnection(socket) {
      // Ваша логика обработки подключения
   }

   gameButtonClick(socket) {
      socket.on('buttonClick', ({ senderName, senderSocketId, receiverName, receiverSocketId, senderTime }) => {
         if (senderSocketId !== receiverSocketId) {
            this.io.to(receiverSocketId).emit('confirm', { senderName, senderSocketId, receiverName, receiverSocketId, senderTime });
         }
      });
   }

   gameReject(socket) {
      socket.on('reject', ({ senderSocketId, receiverName }) => {
         this.io.to(senderSocketId).emit('refusalAlert', { receiverName });
      });
   }

   gameConfirmTrue(socket) {
      socket.on('confirmTrue', ({ senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime }) => {
         // Ваша логика подтверждения
      });
   }

   gameDisconnect(socket) {
      socket.on('disconnect', () => {
         delete activeUsers[socket.id];
         io.emit('activeUsers', activeUsers);
      });
   }
}

export default SocketGame;



// export { io, server };