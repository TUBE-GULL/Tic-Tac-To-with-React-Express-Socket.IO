const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const dataFilePath = path.join(__dirname, '../../data/data.js')
const existingData = require(dataFilePath)
const tokenGeneration = require('./tokenGeneration')


const checkDoubleUserName = (formData) => {
   return existingData.some(el => el.name == formData.name);
}

const checkDoubleUsersNamePs = async (formData) => {
   const user = existingData.find(el => el.name === formData.name);
   if (user && await bcrypt.compare(formData.password, user.password)) {
      return true;
   }
   return false;
}

const singUp = async (req, res) => {
   const formData = req.body

   if (!checkDoubleUserName(formData)) {
      // existingData.push(formData);
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      existingData.push({
         name: formData.name,
         password: hashedPassword,
         token: tokenGeneration(15),
         tim: 0,
      });

      fs.writeFile(dataFilePath, `module.exports = ${JSON.stringify(existingData, null, 2)}`, (err) => {
         if (err) {
            if (err) console.log(err)
         } else {
            console.log('Успешная добавление данных:', formData);
            res.json({ success: true });
         }
      });
   } else {
      console.log('Неудачная регистрация');
      res.status(401).json({ success: false, error: 'данный пользователь занят' });
   }
}

const singIn = async (req, res) => {
   const formData = req.body

   if (await checkDoubleUsersNamePs(formData)) {
      console.log('Successful authentication');
      existingData.forEach(el => {
         if (el.name == formData.name) {
            req.session.user = {
               name: el.name,
               time: el.time,
               token: el.token
            };
         }
      });
      res.json({ success: true })
   } else {
      console.log('Неудачная аутентификация')
      res.status(401).json({ success: false, error: 'Неверный логин или пароль' })
   }
}

module.exports = {
   singUp,
   singIn,
}