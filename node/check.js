

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

   if (checkDoubleUserName(formData)) {
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

app.post('/submit', (req, res) => {
   singUp(req, res)
})

app.post('/submit', (req, res) => {
   singIn(req, res)
})