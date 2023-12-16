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
import usersData from '../../data/data.js';


const checkDoubleUserName = (formData) => {
   return usersData.some(el => el.name == formData.name);
}

const checkDoubleUsersNamePs = async (formData) => {
   const user = usersData.find(el => el.name === formData.name);
   if (user && await bcrypt.compare(formData.password, user.password)) {
      return true;
   }
   return false;
}

const singUp = async (req, res) => {
   const formData = req.body

   if (!checkDoubleUserName(formData)) {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      usersData.push({
         name: formData.name,
         password: hashedPassword,
         token: tokenGeneration(15),
         time: "0:00",
      })

      console.log('Добавлены новые данные:', usersData);

      const jsonData = JSON.stringify(usersData, null, 2);

      // Запись в файл
      fs.writeFile('./data/data.js', jsonData, 'utf8', (error) => {
         if (error) {
            console.error(error);
         } else {
            console.log('Данные успешно записаны в файл.');
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
      usersData.forEach(el => {
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
