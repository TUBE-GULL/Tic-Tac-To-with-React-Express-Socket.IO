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

   const userToken = user.token;
   console.log(`User connected with token: '${userToken}'`);

   // activeUsers[userId] = {
   //    socket.id;
   // }

   socket.emit('token', userToken);


});

// socket.on('disconnect', () => {
//    // Дополнительная логика при отключении пользователя, например, удаление его из списка активных пользователей
//    delete activeUsers[socket.id];
//    console.log(`User disconnected with token: '${userToken}'`);
// });
//=======================================================

// app.listen(8080, () => console.log('Start sever on port 8080'))
server.listen(8080, () => {
   console.log('Socket.IO + Start sever on port 8080');
});
