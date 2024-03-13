import { APP } from "./src/app.js";
import logger from "./src/loggers/logger.service.js";

async function bootstrap() {
   await APP.start();
}

bootstrap();
