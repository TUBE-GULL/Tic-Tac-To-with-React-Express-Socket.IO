const express = require('express')
const app = express()
const { singUp, singIn } = require('./node/components/singInUp.js');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//SING UP=========================================

app.get('/singup', (req, res) => {
   res.sendFile(`${__dirname}/views/registration.html`)
})

app.post('/submit_singup', (req, res) => {
   singUp(req, res)
})

//SING IN=========================================
app.get('/singin', (req, res) => {
   res.sendFile(`${__dirname}/views/login.html`)
})

app.post('/submit_singin', (req, res) => {
   singIn(req, res)
})

//================================================
app.get('/users', (req, res) => {
   res.sendFile(`${__dirname}/views/users.html`)
})


app.get('/data', (req, res) => {
   res.sendFile(`${__dirname}/data/data.js`)
})

app.listen(8080, () => console.log('Start sever on port 8080'))