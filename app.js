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
const { searchToken, } = require('./node/components/function.js')
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

const activeUsers = [];

const user = {}

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
   activeUsers.push({
      name: user.name,
      time: user.time,
      socketId: socket.id // добавляем идентификатор сокета пользователя
   });

   const userToken = user.token;
   console.log(`User connected with token: '${userToken}'`);

   socket.emit('token', userToken);
   io.emit('activeUsers', activeUsers);

   let counter = 0;
   // setInterval(() => {
   //    socket.emit('hello', ++counter);
   // }, 1000);

   socket.on('hi', data => {
      console.log('hi', data);
   });

   socket.on('disconnect', () => {
      // Логика при отключении пользователя, например, удаление из списка активных пользователей
      let indexToRemove = activeUsers.findIndex((u) => u.socketId === socket.id);
      if (indexToRemove !== -1) {
         activeUsers.splice(indexToRemove, 1);
         console.log("Пользователь удален успешно.");
      } else {
         console.log("Пользователь не найден.");
      }
      io.emit('activeUsers', activeUsers);
   });
});

//=======================================================

// app.listen(8080, () => console.log('Start sever on port 8080'))
server.listen(8080, () => {
   console.log('Socket.IO + Start sever on port 8080');
});
