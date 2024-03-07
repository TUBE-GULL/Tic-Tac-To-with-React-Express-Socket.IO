import { App } from "./app";
import Logger from './src/loggers/logger.service';

async function bootstrap() {
   const app = new App(new Logger());
   await app.start();
}

bootstrap();