import * as http from 'http';
import express from 'express';
import logs from './modules/logs';
import router from './routes/router';
import SocketServer from './services/SocketServer';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use('/', router);

const socketServer = new SocketServer(server);

console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');
server.listen(PORT, () => {
   logs();
   console.log(` ➜ \x1b[32mLocal: \x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
   console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
});

export default socketServer;
