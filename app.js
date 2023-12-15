const express = require('express');
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 8080;

// out module
const tokenGeneration = require('./node/components/tokenGeneration.js');
const { searchToken } = require('./node/components/function.js');
const { singUp, singIn } = require('./node/components/singInUp.js');

// Generate a secret key for sessions
const userSecretKey = tokenGeneration(20);

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
   secret: userSecretKey,
   resave: false,
   saveUninitialized: true,
   // cookie: { secure: false } // Задайте secure на true при использовании HTTPS
}))

//SING UP=========================================

app.get('/', (req, res) => {
   res.sendFile(`${__dirname}/views/registration.html`)
})

app.post('/submit_singup', (req, res) => {
   singUp(req, res)
})

//SING IN=========================================
app.get('/singin', (req, res) => {
   res.sendFile(`${__dirname}/views/login.html`)
})

app.post('/submit_singin', (req, res) => {
   singIn(req, res)
})

//game online ======================================

app.get('/game', (req, res) => {
   res.sendFile(`${__dirname}/views/game.html`);
});

//users online ======================================
const activeRooms = {}; // объект для хранения данных комнат
const activeUsers = {} // обьект  пользователей в сети 
const user = {}        // данные пользователя при входе 

app.get('/users', (req, res) => {
   // получаем данные пользователя из сессии
   user.name = req.session.user.name
   user.token = req.session.user.token
   user.timer = req.session.user.time

   if (user.token) {
      // res.cookie('authToken', user.token, { httpOnly: true });
      res.sendFile(path.join(__dirname, '/views/users.html'));
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
         // && senderSocketId !== undefined
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

         const roomName = `room_${senderSocketId}_${receiverSocketId}`;

         // Присоединяем обоих пользователей к комнате
         io.sockets.sockets.get(senderSocketId).join(roomName);
         io.sockets.sockets.get(receiverSocketId).join(roomName);

         // Сохраняем данные комнаты
         activeRooms[roomName] = {
            senderName,
            senderSocketId,
            receiverName,
            receiverSocketId,
            senderTime,
            receiverTime
         };

         // Отправляем сообщение об успешном подтверждении и переход в новую страничку 
         io.to(senderSocketId).emit('confirmed', { senderName, senderSocketId, receiverName, receiverSocketId });
         io.to(receiverSocketId).emit('confirmed', { senderName, senderSocketId, receiverName, receiverSocketId });

         console.log(`Пользователи ${senderName} и ${receiverName} переведены в комнату ${roomName}`);
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
//задача создать 
// 1) проверка вхожа чтобы пользователь не задублировался
// 2) сделать отображения всех пользователь онлайн на клиенте
// 3) взаимодействия с пользователями нажатия на иконку с user 
//    у пользователя к которому отправили уведомления вы берает 
//    зайти ему в сесию или нет
// 4) синхранизация 2 пользователей в сети в одной комнате
// 5) синхранизация работы игры и подстройка ее под двух users
// 6) сбор данных и вывод  в имя пользователя


//=======================================================

server.listen(8080, () => {
   console.log(`Socket.IO + Start sever on port ${PORT}...`);
});
