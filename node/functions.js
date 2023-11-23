const fs = require('fs')

const getHome = (req, res) => {
   fs.readFile('../views/login.html', (error, data) => {
      if (error) {
         res.statusCode = 500
         res.setHeader('Content-Type', 'text/plain')
         res.end('Server error while loading HTML file')
      } else {
         res.statusCode = 200
         res.setHeader('Content-Type', 'text/html')
         res.end(data)
      }
   })
}

module.exports = {
   getHome
}