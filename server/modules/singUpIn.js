import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import readFileJson from './readFileJson.js';
import writeFileJson from './writeFileJson.js';
import tokenGeneration from './tokenGeneration.js';

//copy data.json for fast request
const userData = await readFileJson('../data/data.json');
const config = await readFileJson('./config.json');

//check FirstsName name from data
const checkUserFirstsName = (formData) => {
   return userData.some(el => el.Nickname == formData.Nickname);
};

//check user password from data 
const checkUserDoubleNamePassword = async (formData) => {
   const user = userData.find(el => el.Nickname === formData.Nickname);
   if (user && await bcrypt.compare(formData.password, user.password)) {
      return true;
   }
   return false;
};

//main function for sing Up 
const singUp = async (req, res) => {
   const formData = req.body;
   console.log('singUp')
   if (!checkUserFirstsName(formData)) {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const newUser = {
         id: await tokenGeneration(10),
         Nickname: formData.Nickname,
         password: hashedPassword,
         time: ''
      };
      userData.push(newUser);
      await writeFileJson(userData, '../data/data.json');

      console.log('➜ Successful Registration');
      res.json({ success: true });
   } else {
      console.log('➜ Registration failed');
      res.status(401).json({ success: false, error: 'This user is busy !' });
   }
};

const singIn = async (req, res) => {
   const { authToken } = req.cookies;
   const Cookie = await readFileJson('../data/cookie.json');

   if (Cookie.includes(authToken)) {
      console.log('User authenticated via cookie');
      res.json({ success: true });
   } else {
      const formData = req.body;
      console.log(formData)
      try {
         if (await checkUserFirstsName(formData) && await checkUserDoubleNamePassword(formData)) {
            console.log('➜ Successful authentication');
            const user = userData.find(el => el.Nickname === formData.Nickname);
            const token = jwt.sign({ id: user.id }, config.secretKey, { expiresIn: '1h' });

            Cookie.push(token);
            await writeFileJson(Cookie, '../data/cookie.json');

            res.cookie('authToken', token);

            res.json({ success: true });
         } else {
            console.log('➜ Authentication failed');
            res.status(401).json({ success: false, error: 'Wrong login or password !' });
         }
      } catch (error) {
         console.error('Error during sign in:', error);
         res.status(500).json({ success: false, error: 'Internal Server Error' });
      };
   }
};


export { singUp, singIn };
