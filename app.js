const express = require('express')
const DATA = require('./data/data')

const app = express()
app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(`${__dirname}/views/login.html`)
})

app.post('/', (req, res) => {
   const formData = req.body
   console.log(formData)
})

app.listen(8080, () => console.log('Start sever on port 8080'))