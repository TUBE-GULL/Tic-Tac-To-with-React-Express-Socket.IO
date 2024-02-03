import http from 'http';
import express from 'express';
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

//modules
import logs from './modules/logs.js';
import { singUp, singIn } from './modules/singUpIn.js'
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
   singUp(req, res);
});

app.post('/submit_singIn', async (req, res) => {
   singIn(req, res);
});

io.on('connection', (socket) => {

   // jwt.verify()
});

console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');
server.listen(PORT, () => {
   logs();
   console.log(` ➜ \x1b[32mLocal: \x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
   console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
});