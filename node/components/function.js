const data = require('../../data/data')

const searchToken = (name) => {
   const user = data.find(el => el.name === name);
   return user ? user.token : undefined;
};

module.exports = {
   searchToken,
}