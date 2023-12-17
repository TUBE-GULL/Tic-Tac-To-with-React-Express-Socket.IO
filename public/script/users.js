// import React from 'react';
// import ReactDOM from 'react-dom';
import GamePage from './module/GamePage'

const socket = io('http://localhost:8080');
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

socket.on('confirmed', ({ senderName, senderSocketId, receiverName, receiverSocketId }) => {
   ReactDOM.render(<GamePage />, document.getElementById('root'));
});

socket.on('refusalAlert', ({ receiverName }) => {
   alert(`${receiverName} отказался принять сообщение`);
});

// ReactDOM.render(<GamePage />, document.getElementById('root'));
