const socket = io('http://localhost:8080');
const $events = document.getElementById('events');
const $userList = document.getElementById('userList')

// const newItem = (content) => {
//    const item = document.createElement('li');
//    item.innerText = content;
//    return item;
// }

const displayUserList = (users) => {
   $userList.innerHTML = ''; // очищаем предыдущий список
   users.forEach(user => {
      const item = document.createElement('li');
      item.innerText = `${user.name} ${user.time}`;
      $userList.appendChild(item);
   });
}

socket.on('connect', () => {
   $events.appendChild(newItem('Подключение установлено'));
});

socket.on('hello', (counter) => {
   $events.appendChild(newItem(`Привет - ${counter}`));
});

// Получение списка активных пользователей от сервера
socket.on('activeUsers', (users) => {
   displayUserList(users);
});

