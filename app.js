const session = require('express-session');
const socketIo = require('socket.io');
const crypto = require('crypto')
const express = require('express');
const http = require('http');
const path = require('path');
// const app = express()
// const server = http.createServer(app);
// const io = socketIo(server);
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
// out module
const { singUp, singIn } = require('./node/components/singInUp.js')

const userSecretKey = crypto.randomBytes(20).toString('hex')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(session({
   secret: userSecretKey, // Секретный ключ для подписи сессии, должен быть уникальным
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

let user = ''
let userTime = ''

app.get('/users', (req, res) => {
   user = req.session.user.name; // получаем имя пользователя из сессии
   userTime = req.session.user.time; // получаем время пользователя из сессии
   res.sendFile(path.join(__dirname, '/views/users.html'));
});

io.on('connection', (socket) => {
   // Отправляем текущий список пользователей при подключении
   io.to(socket.id).emit('updateUsers', users);

   // const user = req.session.user.name; // получаем имя пользователя из сессии
   // const userTime = req.session.user.time; // получаем время пользователя из сессии
   users[socket.id] = {
      name: user,
      time: userTime,
      socket: socket.id
   };

   // Оповещаем клиентов о подключении нового пользователя
   io.emit('userConnected', users[socket.id]);

   socket.on('disconnect', () => {
      // Удаляем пользователя из объекта пользователей и оповещаем об отключении
      io.emit('userDisconnected', socket.id);
      delete users[socket.id];
   });
});

// app.listen(8080, () => console.log('Start sever on port 8080'))

server.listen(8080, () => {
   console.log('Socket.IO + Start sever on port 8080');
});

// app.get('/data', (req, res) => {
//    res.sendFile(`${__dirname}/data/data.js`)
// })
