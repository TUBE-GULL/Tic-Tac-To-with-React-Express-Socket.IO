import { getAbsolutePath } from "../modules/getAbsolutePath.js";

//users online ======================================
const user = {};

const gameLobby = (req, res) => {
   // получаем данные пользователя из сессии
   user.name = req.session.user.name;
   user.token = req.session.user.token;
   user.timer = req.session.user.time;

   if (user.token) {
      res.sendFile(getAbsolutePath('../client/src/html/game.html'));
   } else {
      res.status(401).json({ success: false, error: 'Пользователь не аутентифицирован' });
   }
}

export { gameLobby, user }