import { App } from "./src/app.js";
import Logger from './src/loggers/logger.service.js';

async function bootstrap() {
   const app = new App(new Logger());
   await app.start();
}

bootstrap();