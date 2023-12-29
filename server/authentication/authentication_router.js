import express from 'express';
import session from 'express-session';
import { singUp, singIn } from './authentication.js';
import { getAbsolutePath } from '../modules/getAbsolutePath.js';

const authenticationRouter = express.Router();
authenticationRouter.use(express.json());

//SING UP=========================================

authenticationRouter.get('/', (req, res) => {
   res.sendFile(getAbsolutePath('../client/src/html/authentication_sign_Up.html'));
})

authenticationRouter.post('/submit_singup', (req, res) => {
   singUp(req, res);
})

//SING IN=========================================
authenticationRouter.get('/singin', (req, res) => {
   res.sendFile(getAbsolutePath('../client/src/html/authentication_sign_In.html'));
})

authenticationRouter.post('/submit_singin', (req, res) => {
   singIn(req, res);
})


export { authenticationRouter };