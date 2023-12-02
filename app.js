const session = require('express-session')
const socketIo = require('socket.io')
const express = require('express')
const http = require('http')
const path = require('path')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// out module
const tokenGeneration = require('./node/components/tokenGeneration.js')
const { singUp, singIn } = require('./node/components/singInUp.js')

const userSecretKey = tokenGeneration(20)

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

//users online ======================================

const users = {};

const user = {}

app.get('/users', (req, res) => {
   const user = req.session.user; // получаем данные пользователя из сессии
   const userToken = user ? user.Token : null;



   if (userToken) {
      res.sendFile(path.join(__dirname, '/views/users.html'));
   } else {
      res.status(401).json({ success: false, error: 'Пользователь не аутентифицирован' });
   }
});


// io.on('connection', (socket) => {
//    // Отправляем текущий список пользователей при подключении
//    io.to(socket.id).emit('updateUsers', users);

//    users[socket.id] = {
//       name: user.name,
//       time: user.userTime,
//       socket: user.userToken
//    };
//    // Оповещаем клиентов о подключении нового пользователя
//    io.emit('userConnected', users[socket.id]);

//    socket.on('disconnect', () => {
//       // Удаляем пользователя из объекта пользователей и оповещаем об отключении
//       io.emit('userDisconnected', socket.id);
//       delete users[socket.id];
//       socket.emit('redirect', '/views/login.html'); // Отправляем сообщение клиенту о перенаправлении
//    });
// });


//=======================================================

// app.listen(8080, () => console.log('Start sever on port 8080'))
server.listen(8080, () => {
   console.log('Socket.IO + Start sever on port 8080');
});

// app.get('/data', (req, res) => {
//    res.sendFile(`${__dirname}/data/data.js`) 
// })
 
 
// io.use((socket, next) => {
//    // Промежуточное ПО для обработки аутентификации перед установлением соединения
//    const token = socket.handshake.auth.token; // Предполагается, что токен передается как 'token' в объекте auth

//    // Ваша логика для проверки токена и связывания его с пользователем
//    const user = validateToken(token); // Замените своей логикой валидации

//    if (user) {
//       // Если токен действителен, добавляем пользователя в сокет
//       socket.user = user;
//       return next();
//    } else {
//       // Если токен недействителен, отклоняем соединение
//       return next(new Error('Аутентификация не удалась'));
//    }
// });

// io.on('connection', (socket) => {
//    // Доступ к информации о пользователе, связанной с сокетом
//    const user = socket.user;

//    // Ваша логика для обработки подключенного пользователя
//    console.log(`Пользователь ${user.name} подключен`);

//    // Отправка событий и т.д.

//    socket.on('disconnect', () => {
//       // Ваша логика для обработки отключения
//       console.log(`Пользователь ${user.name} отключен`);
//    });
// });