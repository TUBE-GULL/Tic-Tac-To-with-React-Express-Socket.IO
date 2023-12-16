// const bcrypt = require('bcrypt');
// const session = require('express-session');
// const path = require('path');
// const fs = require('fs');
// const dataFilePath = path.join(__dirname, '../../data/data.js')
// const existingData = require(dataFilePath)
// const tokenGeneration = require('./tokenGeneration')
import bcrypt from 'bcrypt';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url'; // Добавляем этот модуль для работы с URL
import fs from 'fs/promises';
import tokenGeneration from './tokenGeneration.js';
import userData from '../../data/data.js';


const checkDoubleUserName = (formData) => {
   return userData.some(el => el.name == formData.name);
}

const checkDoubleUsersNamePs = async (formData) => {
   const user = userData.find(el => el.name === formData.name);
   if (user && await bcrypt.compare(formData.password, user.password)) {
      return true;
   }
   return false;
}

const singUp = async (req, res) => {
   const formData = req.body

   if (!checkDoubleUserName(formData)) {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      //    userData.push({
      //       name: formData.name,
      //       password: hashedPassword,
      //       token: tokenGeneration(15),
      //       time: 0,
      //    });

      const newUser = {
         name: formData.name,
         password: hashedPassword,
         token: tokenGeneration(15),
         time: 0,
      };

      userData.push(newUser);

      try {
         await fs.writeFile('../../data/data.js', JSON.stringify(userData), 'utf8');
         console.log('Пользователь успешно добавлен в файл');
      } catch (error) {
         console.error('Ошибка при записи файла:', error);
         res.status(500).json({ success: false, error: 'Ошибка сервера' });
      }
      // try {
      //    // Write the updated userData array back to the file
      //    const dataFilePath = path.join(dataDirectory, 'data.js');
      //    const dataString = `export default ${JSON.stringify(userData, null, 2)}`;
      //    await fs.promises.writeFile(dataFilePath, dataString, 'utf8');

      //    console.log('successful push data:', formData);
      //    res.json({ success: true });
      // } catch (error) {
      //    console.error('Error writing data to file:', error);
      //    res.status(500).json({ success: false, error: 'Internal Server Error' });
      // }
   } else {
      console.log('Неудачная регистрация');
      res.status(401).json({ success: false, error: 'данный пользователь занят' });
   }
}

const singIn = async (req, res) => {
   const formData = req.body

   if (await checkDoubleUsersNamePs(formData)) {
      console.log('Successful authentication');
      userData.forEach(el => {
         if (el.name == formData.name) {
            req.session.user = {
               name: el.name,
               token: el.token,
               time: el.time,
            };
         }
      });
      res.json({ success: true })
   } else {
      console.log('Неудачная аутентификация')
      res.status(401).json({ success: false, error: 'Неверный логин или пароль' })
   }
}

export { singUp, singIn };
