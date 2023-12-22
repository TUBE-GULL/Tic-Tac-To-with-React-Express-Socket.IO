const listOnlineUsers = () => {
   return React.createElement('div', { className: 'user-column' },
      React.createElement('h2', {}, 'Online Users'),
      React.createElement('ul', { id: 'userList' })
   );
}

export default listOnlineUsers;