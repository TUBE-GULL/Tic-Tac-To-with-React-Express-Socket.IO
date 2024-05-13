import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { authenticated } from '../app.js';
import getAbsolutePath from '../common/modules/getAbsolutePath.js';

const router = express.Router();

router.use(express.json());
router.use(express.static(getAbsolutePath('../client/dist')));
router.use(cookieParser());

router.use((req: Request, res: Response, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Credentials', 'true');
   next();
});

router.get('/', (req: Request, res: Response) => {
   res.sendFile(getAbsolutePath('../client/dist/index.html'));
});

router.post('/submit_singUp', (req: Request, res: Response) => {
   authenticated.singUp(req, res);
});

router.post('/submit_singIn', async (req: Request, res: Response) => {
   authenticated.singIn(req, res);
});

export default router;
