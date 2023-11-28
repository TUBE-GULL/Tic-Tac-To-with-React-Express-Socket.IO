const express = require('express')
const path = require('path');
const fs = require('fs');
const dataFilePath = path.join(__dirname, 'data', 'data.js')
const existingData = require(dataFilePath)
const app = express()


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
   res.sendFile(`${__dirname}/views/login.html`)
})

app.post('/submit', (req, res) => {
   const formData = req.body

   console.log('Registration:', formData.registration === '1' ? true : false);
   //добавить проверку на наличия похожего users !!!
   if (formData.registration === '1' ? true : false) {  // добовляет пользователя в DATA
      existingData.push(formData);
      console.log(existingData)

      fs.writeFile(dataFilePath, `module.exports = ${JSON.stringify(existingData, null, 2)}`, (err) => {
         if (err) {
            if (err) console.log(err)
         } else {
            console.log('Успешная добавление данных:', formData);
            res.json({ success: true });
         }
      });

   } else {
      //проверка на наличия похожего человека на сервере в DATA
      //если да переход на другую страницу
      //если нет то вы водиться смс на странице без перезагрузки старницы 
      const existingData = require(dataFilePath);
      const result = existingData.some(el => el.name == formData.name && el.password == formData.password);
      console.log(formData)
      console.log(existingData)
      if (result) {
         console.log('Успешная аутентификация');
         res.json({ success: true });
      } else {
         console.log('Неудачная аутентификация');
         res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
      }
   }
})

app.get('/data', (req, res) => {
   res.sendFile(`${__dirname}/data/data.js`)
})

app.listen(8080, () => console.log('Start sever on port 8080'))


// 1) провека на заполнения окно происходит на клиенте
// 2) проверка на рестрацию происходит на сревере
// 3) проверка на вход если пользователь не нажал checbox 

