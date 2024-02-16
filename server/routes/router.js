import express from 'express';
import cookieParser from 'cookie-parser';
import authenticated from '../services/authenticated.js';
import getAbsolutePath from '../modules/getAbsolutePath.js';
const router = express.Router();

router.use(express.json());
router.use(express.static(getAbsolutePath('../client/dist')));
router.use(cookieParser());

router.get('/', (req, res) => {
   res.sendFile(getAbsolutePath('../App/dist/index.html'));
});

router.post('/submit_singUp', (req, res) => {
   authenticated.singUp(req, res);
});

router.post('/submit_singIn', async (req, res) => {
   authenticated.singIn(req, res);
});

export default router