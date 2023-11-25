const fs = require('fs')

// const userSearch = (user, password, array) => {
//    array.forEach(el => {

//       console.log(typeof (+password))
//       console.log(typeof (el.password))
//       if (el.name === user && el.password === +password) {
//          return true
//       }
//    });
//    return false
// }
const userSearch = (user, password, array) => {
   return array.some(el => el.name === user && el.password === +password);
};



module.exports = {
   userSearch,
}