import http from 'http';
import express from 'express';
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

//modules
import logs from './modules/logs.js';
import authenticated from './services/authenticated.js';
import getAbsolutePath from './modules/getAbsolutePath.js';
import readFileJson from './modules/readFileJson.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(getAbsolutePath('../client/dist')));
app.use(cookieParser());

app.get('/', (req, res) => {
   res.sendFile(getAbsolutePath('../App/dist/index.html'));
});

app.post('/submit_singUp', (req, res) => {
   authenticated.singUp(req, res);
});

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'http://localhost:8080/');
   res.header('Access-Control-Allow-Credentials', true);
   next();
});

app.post('/submit_singIn', async (req, res) => {
   authenticated.singIn(req, res);
});

io.on('connection', (socket) => {
   const authToken = socket.handshake.headers.authorization; // Получаем токен из заголовков
   try {
      const decodedToken = jwt.verify(authToken, config.secretKey);
      const userId = decodedToken.id;
      console.log(userId);
      const user = socket.handshake.headers;
      console.log(user);


   } catch (error) {
      console.error('Error verifying token:', error);
   }
});
console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');
server.listen(PORT, () => {
   logs();
   console.log(` ➜ \x1b[32mLocal: \x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
   console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
});