const socket = io('http://localhost:8080');
const column = document.querySelector('user-column')
// const use = document.('userList')


socket.on('connect', () => {
   console.log('Connected to server');
});

socket.on('token', (serverToken) => {
   console.log(`Received token from server: ${serverToken}`);
   // Дополнительная логика на стороне клиента, связанная с токеном, если необходимо
});
socket.on('userConnected', ({ userId }) => {
   console.log(`User with ID ${userId} connected`);
   // Добавьте логику обновления вашего интерфейса с новым пользователем
   // addUserToUI(userId);
});

socket.on('userDisconnected', ({ userId }) => {
   console.log(`User with ID ${userId} disconnected`);
   // Добавьте логику обновления вашего интерфейса при отключении пользователя
   // removeUserFromUI(userId);
});

socket.on('activeUsers', (users) => {
   console.log('Active users:', users);
   // Добавьте логику для обновления вашего интерфейса с новым списком пользователей
   // updateUsersList(users);
});