import express from 'express';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

// Generate a secret key for sessions
const userSecretKey = await tokenGeneration(20);

// out module
import tokenGeneration from './node/components/function/tokenGeneration.js';
import { singUp, singIn } from './node/components/singInUp.js';
import startTimerForRoom from './node/components/function/components/startTimerForRoom.js';

app.use(express.static('public'))
app.use('/node_modules', express.static('node_modules', { 'Content-Type': 'application/javascript' }))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
   secret: userSecretKey,
   resave: false,
   saveUninitialized: true,
   // cookie: { secure: false } // Задайте secure на true при использовании HTTPS
}))
app.use('/script', express.static('script'));

function getAbsolutePath(relativePath) {
   return path.join(new URL(relativePath, import.meta.url).pathname);
}
//SING UP=========================================

app.get('/', (req, res) => {
   res.sendFile(getAbsolutePath('./views/registration.html'))
})

app.post('/submit_singup', (req, res) => {
   singUp(req, res)
})

//SING IN=========================================
app.get('/singin', (req, res) => {
   res.sendFile(getAbsolutePath('./views/login.html'))
})

app.post('/submit_singin', (req, res) => {
   singIn(req, res)
})

//users online ======================================
const activeRooms = {}; // объект для хранения данных комнат
const roomTimers = {};  // обьект для хранения времени комнат 
const activeUsers = {} // обьект  пользователей в сети 
const user = {}        // данные пользователя при входе 

app.get('/users', (req, res) => {
   // получаем данные пользователя из сессии
   user.name = req.session.user.name
   user.token = req.session.user.token
   user.timer = req.session.user.time

   if (user.token) {
      // res.cookie('authToken', user.token, { httpOnly: true });
      res.sendFile(getAbsolutePath('./views/users.html'))
      // res.sendFile(path.join(__dirname, '/views/users.html')); (getAbsolutePath('/views/login.html'))
   } else {
      res.status(401).json({ success: false, error: 'Пользователь не аутентифицирован' });
   }
});

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
               // console.log(gameData)
               const oneUser = {
                  oneUserName: gameData.senderName,
                  oneUserSocketId: gameData.senderSocketId,
                  offNo: true,
               };
               const twoUser = {
                  twoUserName: gameData.senderName,
                  twoUserSocketId: gameData.receiverSocketId,
                  offNo: false,
               };

               // const randomTicTacToe = getRandomTicTacToe() добавить рандомное появления x o 

               const xSymbol = 'x';
               const oSymbol = 'o';

               io.to(oneUser.oneUserSocketId).emit('Games', { symbol: xSymbol, offNo: oneUser.offNo });
               io.to(twoUser.twoUserSocketId).emit('Games', { symbol: oSymbol, offNo: twoUser.offNo });

               // io.to(roomForGame).emit('Games', { randomTicTacToe });

               const dataFieldGames = [] // 9  

               const handleCellClick = (data, user, symbol) => {
                  const index = data.index;
                  dataFieldGames[index] = data.content;

                  io.to(oneUser.oneUserSocketId).emit('updateGame', { dataFieldGames });
                  io.to(twoUser.twoUserSocketId).emit('updateGame', { dataFieldGames });
                  io.to(user.userSocketId).emit('Games', { symbol, offNo: user.offNo });

                  switchOnOff(user);
               };

               socket.on('clickCell', (data) => {
                  handleCellClick(data, oneUser, xSymbol);
               });

               // socket.on('clickCellTwo', (data) => {
               //    handleCellClick(data, twoUser, oSymbol);
               // });
            })


            // function games +++++++++++++++++++++++++++++++++++++++++++++++

            const switchOnOff = (userObject) => {
               userObject.offNo = !userObject.offNo;
            };

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
            }

            const checkDraw = () => {
               return cells.every(cell => cell !== '');
            }

            const resetGame = () => {
               cells.fill('');
               currentPlayer = 'X';
               io.emit('updateBoard', { cells, currentPlayer });
            }

         } else {
            console.log(`Пользователи ${senderName} и ${receiverName} уже находятся в комнате ${roomForGame}`);
         }
      } else {
         console.log('Невалидные сокеты');
      }
   });

   socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
      delete activeUsers[socket.id]
      io.emit('activeUsers', activeUsers)
   })
})

//=======================================================

server.listen(PORT, () => {
   console.log(`Socket.IO + Start sever on port ${PORT}...`);
});
