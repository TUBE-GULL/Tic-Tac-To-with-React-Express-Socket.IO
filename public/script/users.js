import GameStart from '/script/gameStart.js';

const socket = io('http://localhost:8080');

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const $events = document.getElementById('events');
const $userList = document.getElementById('userList');

const thisUser = {};

socket.on('userData', (userData) => {
   thisUser.name = userData.user.name;
   thisUser.time = userData.user.timer;
   thisUser.socketId = userData.socketId;
   console.log(`Successful authentication ${userData.user.name} ${userData.user.timer}`);
});

socket.on('activeUsers', users => {
   $userList.innerHTML = '';
   for (const userId in users) {
      const user = users[userId];
      const item = document.createElement('button');
      item.innerText = `${user.name} ${user.time}`;
      item.id = userId; // добавления кнопкам id  для легко поиска 
      $userList.appendChild(item);

      item.addEventListener('click', () => {
         const senderTime = thisUser.time;
         console.log(`Button clicked for user: ${thisUser.name} ${user.name}`);
         socket.emit('buttonClick', { senderName: thisUser.name, senderSocketId: thisUser.socketId, receiverName: user.name, receiverSocketId: user.socketId, senderTime });
      });
      $userList.appendChild(item);
   }
});

socket.on('confirm', ({ senderName, senderSocketId, receiverName, receiverSocketId, senderTime }) => {
   const confirmed = confirm(`${senderName} отправил сообщение пользователю ${receiverName}`);

   if (confirmed) {
      const receiverTime = thisUser.time;
      socket.emit('confirmTrue', { senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime });
   } else {
      socket.emit('reject', { senderSocketId, receiverName });
   }
});

socket.on('confirmed', ({ senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime }) => {
   root.render(
      React.createElement(GameStart, {
         senderName: senderName,
         senderTime: senderTime,
         receiverName: receiverName,
         receiverTime: receiverTime
      })
   );
   const gameData = { senderName, senderSocketId, receiverName, receiverSocketId, senderTime, receiverTime }
   socket.emit('startGame', (gameData));
});

socket.on('refusalAlert', ({ receiverName }) => {
   alert(`${receiverName} отказался принять запрос на начало игры`);
});
//сделать проверку на то вдруг пользователь вышел или у него оборвало интернет 
//то пользователя должно  отправлять обрано в центральное меню приложения 

// function timer +++++++++++++++++++++++++++++++++++++++++++++++

socket.on('timerUpdate', ({ time }) => {
   const timerElement = document.getElementById('timer');

   timerElement.textContent = time;
});

// function game +++++++++++++++++++++++++++++++++++++++++++++++

socket.on('Games', ({ symbol, offNo }) => {
   console.log('connection server')
   const cells = document.getElementsByClassName('cell');
   const arrayCells = [...cells];
   // console.dir(cells);
   arrayCells.forEach((cell, index) => {
      try {
         console.log(symbol);

         if (!offNo) {
            cell.addEventListener('click', () => {
               cell.textContent = symbol;
               console.dir(cell.textContent);

               const cellData = {
                  index: index,
                  content: symbol,
               };

               socket.emit('clickCell', cellData);
            });
         }
      } catch (error) {
         console.error('Error processing Games event:', error);
      }
   });

   //функция для обновления страницы у всех пользователей после нажатия 
   socket.on('updateGame', (data) => {
      const updatedCells = data.dataFieldGames;

      for (const index in updatedCells) {
         const cell = arrayCells[index];
         if (cell) {
            cell.textContent = updatedCells[index];
         }
      }
   });

});




//функция по перерисовке игрового поля 

// socket.on('activeUsers', users => {
//    $userList.innerHTML = '';
//    for (const userId in users) {
//       const user = users[userId];
//       const item = document.createElement('button');
//       item.innerText = `${user.name} ${user.time}`;
//       item.id = userId; // добавления кнопкам id  для легко поиска 
//       $userList.appendChild(item);

//       item.addEventListener('click', () => {
//          const senderTime = thisUser.time;
//          console.log(`Button clicked for user: ${thisUser.name} ${user.name}`);
//          socket.emit('buttonClick', { senderName: thisUser.name, senderSocketId: thisUser.socketId, receiverName: user.name, receiverSocketId: user.socketId, senderTime });
//       });
//       $userList.appendChild(item);
//    }
// });


// socket.on('updateGame', (data) => {

//    arrayCells.forEach((cell, index) => {
//       try {
//          console.log(symbol);


//       } catch (error) {
//          console.error('Error processing Games event:', error);
//       }
//    });
// });

