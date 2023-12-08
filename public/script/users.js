const socket = io('http://localhost:8080');
const $events = document.getElementById('events');
const $userList = document.getElementById('userList')

let activeUser;

socket.on('userData', (userData) => {
   activeUser = userData
   console.log(`Получено имя пользователя: ${activeUser}`);
   // Делайте что-то с именем пользователя, если это необходимо
});

const displayUserList = (users) => {
   $userList.innerHTML = ''; // очищаем предыдущий список
   users.forEach(user => {
      const item = document.createElement('button');
      item.innerText = `${user.name} ${user.time}`;
      $userList.appendChild(item);

      // Создаем функцию-обертку с использованием замыкания
      const handleClick = (senderName, receiverSocketId) => {
         return () => {
            // Отправляем сообщение серверу о клике на кнопку и передаем информацию о себе
            socket.emit('buttonClick', { sender: senderName, receiverSocketId });
         };
      };

      // Добавляем обработчик события click
      item.addEventListener('click', handleClick(user.name, user.socketId));

      $userList.appendChild(item);
   });
}

socket.on('confirm', ({ receiver }) => {
   confirm(`${activeUser} отправил сообщение пользователю ${receiver}`);
});

socket.on('activeUsers', (users) => {
   console.log(users)
   displayUserList(users);
});

