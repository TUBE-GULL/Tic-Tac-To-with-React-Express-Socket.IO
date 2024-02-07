import readFileJson from './readFileJson.js';

async function searchUser(id, url) {
   const Data = await readFileJson(url);

   Data.find(el => el)
}

export default searchUser