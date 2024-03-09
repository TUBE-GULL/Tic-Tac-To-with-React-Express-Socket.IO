import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authenticated from '../services/authenticated.js';
import getAbsolutePath from '../modules/getAbsolutePath.js';

const router = express.Router();

router.use(express.json());
router.use(express.static(getAbsolutePath('../client/dist')));
router.use(cookieParser());

router.get('/', (req: Request, res: Response) => {
   res.sendFile(getAbsolutePath('../App/dist/index.html'));
});

router.post('/submit_singUp', (req: Request, res: Response) => {
   authenticated.singUp(req, res);
});

router.post('/submit_singIn', async (req: Request, res: Response) => {
   await authenticated.singIn(req, res);
});

export default router;
