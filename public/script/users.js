const socket = io('http://localhost:8080');

// После успешной регистрации или аутентификации
socket.emit('authenticate', userToken);

// При получении ответа с сервера
socket.on('authenticated', (user) => {
   console.log(`Клиент аутентифицирован: ${socket.id}, пользователь:`, user);

   // Ваши дальнейшие действия с аутентифицированным сокетом...
});

// При получении списка пользователей
socket.on('updateUsers', (users) => {
   // Обновление вашего интерфейса с новым списком пользователей
   console.log('Update users:', users);
});

// При подключении нового пользователя
socket.on('userConnected', (user) => {
   console.log(`${user.name} connected`);
   // Обновление вашего интерфейса с новым пользователем
});

// При отключении пользователя
socket.on('userDisconnected', (userId) => {
   console.log(`User with ID ${userId} disconnected`);
   // Обновление вашего интерфейса при отключении пользователя
});




// socket.emit('message', 'Hello, my name is Client');

// socket.on('updateUsers', (users) => {
//    // Обработчик события для обновления списка пользователей при подключении
//    console.log('Update users:', users);
//    // Добавьте логику для обновления вашего интерфейса с новым списком пользователей
//    // updateUsersList(users);
// });

// socket.on('userConnected', (user) => {
//    // Обработчик события подключения нового пользователя
//    console.log(` Name:${user.name} Token:${user.socket} connected`);
//    // Добавьте логику для обновления вашего интерфейса с новым пользователем
//    // addUserToUI(user);
// });

// socket.on('userDisconnected', (userId) => {
//    // Обработчик события отключения пользователя
//    console.log(`User with ID ${userId} disconnected`);
//    // Добавьте логику для обновления вашего интерфейса при отключении пользователя
//    // removeUserFromUI(userId);
// });

// const userColumn = document.querySelector('.user-column');

// const updateUsersList = (users) => {
//    // Очищаем текущий список пользователей
//    userColumn.innerHTML = '';

//    // Добавляем каждого пользователя в список
//    users.forEach((user) => {
//       addUserToUI(user);
//    });
// };

// const addUserToUI = (user) => {
//    const userElement = document.createElement('li');
//    userElement.textContent = `${user.name} (${user.time})`;
//    userColumn.appendChild(userElement);
// };

// const removeUserFromUI = (userId) => {
//    // Находим и удаляем пользователя из списка по userId
//    const userElementToRemove = document.querySelector(`li[data-user-id="${userId}"]`);
//    if (userElementToRemove) {
//       userElementToRemove.remove();
//    }
// };
