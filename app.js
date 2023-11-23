const http = require('http')
const fs = require('fs')
const express = require('express')
const { getHome } = require('./node/functions')

const app = express()
const PORT = 5000

app.use(express.static('public'));

app.get('/', (req, res) => res.send('hi'))

app.listen(PORT, () => console.log(`server start on port${PORT}`))

app.get('/login', (req, res) => {
   res.sendFile(`${__dirname}/views/login.html`);
});
// const server = http.createServer((req, res) => {
//    if (req.method === 'GET' && req.url === '/') {
//       return getHome(req, res)
//    }
// })


// server.listen(PORT, () => {
//    console.log(`Server was launched on port ${PORT}`)
// })

