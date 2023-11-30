const socket = io('http://localhost:8080');

socket.emit('message', 'Hello, my name is Client');

socket.on('updateUsers', (users) => {
   // Обработчик события для обновления списка пользователей при подключении
   console.log('Update users:', users);
   // Добавьте логику для обновления вашего интерфейса с новым списком пользователей
});

socket.on('userConnected', (user) => {
   // Обработчик события подключения нового пользователя
   console.log(`${user.name} connected`);
   // Добавьте логику для обновления вашего интерфейса с новым пользователем
});

socket.on('userDisconnected', (userId) => {
   // Обработчик события отключения пользователя
   console.log(`User with ID ${userId} disconnected`);
   // Добавьте логику для обновления вашего интерфейса при отключении пользователя
});