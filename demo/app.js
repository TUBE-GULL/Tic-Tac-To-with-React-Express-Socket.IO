
import babelRegister from '@babel/register';

import babelConfig from './public/babel.config.js';

babelRegister(babelConfig);
//=======================================================
//для работы Jsx ? 

app.use(express.static('public'));

app.use('/script', (req, res, next) => {
   const filename = path.join(__dirname, 'public', req.path);

   if (filename.endsWith('.jsx')) {
      res.type('application/javascript');
      res.sendFile(filename);
   } else {
      next();
   }
});

//=======================================================