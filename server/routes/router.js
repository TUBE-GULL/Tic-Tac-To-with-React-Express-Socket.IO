import express from 'express';
import session from 'express-session';
import path from 'path';
import { getAbsolutePath } from '../modules/getAbsolutePath.js';
import { tokenGeneration } from '../modules/tokenGeneration.js';
import { authenticationRouter } from '../authentication/authentication_router.js';
import { gameLobby, user } from '../game/game_lobby.js';

const router = express.Router();
const sessionKey = await tokenGeneration(20);
const clientPath = path.join(getAbsolutePath(('../client/src')));

router.use(express.static(clientPath));

router.use(session({
   secret: sessionKey,
   resave: false,
   saveUninitialized: true,
}));

router.use('/', authenticationRouter);

router.get('/game', (req, res) => {
   gameLobby(req, res)
});

export { router, user };
