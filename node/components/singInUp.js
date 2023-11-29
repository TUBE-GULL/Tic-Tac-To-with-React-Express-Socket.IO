const path = require('path');
const fs = require('fs');
const dataFilePath = path.join(__dirname, '../../data/data.js')
const existingData = require(dataFilePath)

const checkDoubleUserName = (formData) => {
   return existingData.some(el => el.name == formData.name);
}
const checkDoubleUsersNamePs = (formData) => {
   return existingData.some(el => el.name == formData.name && el.password == formData.password);
}

const singIn = (req, res) => {
   const formData = req.body

   if (checkDoubleUsersNamePs(formData)) {
      console.log('Успешная аутентификация');
      res.json({ success: true });
   } else {
      console.log('Неудачная аутентификация');
      res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
   }
}
const singUp = (req, res) => {
   const formData = req.body

   if (!checkDoubleUserName(formData)) {
      existingData.push(formData);

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

module.exports = {
   singUp,
   singIn,
}