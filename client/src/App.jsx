import React, { useState, useEffect } from 'react'
import Authorization from './modules/authorization/Authorization';
import Lobby from './modules/lobby/Lobby'
import io from 'socket.io-client';

export const EntranceLobby = React.createContext()

function App() {
  const [showAuthorization, setShowAuthorization] = useState(true);
  const [socketFormData, setSocketFormData] = useState('');

  // socket setShowAuthorization(!showAuthorization)


  // const { SocketFormData } = useContext(EntranceLobby);
  // const [socket, setSocket] = useState(null);
  // const [userData, setUserData] = useState('');

  // useEffect(() => {
  //   const Socket = io('');
  //   setSocket(Socket);

  //   const switchOff = () => {
  //     console.log('undefined')
  //     setShowAuthorization(!showAuthorization);
  //   }

  //   const handleToGetUserData = (user) => {
  //     console.log(user)
  //     // return setUserData(user);
  //   };

  //   Socket.on('undefined', switchOff);
  //   Socket.on('userData', handleToGetUserData);

  //   return () => {
  //     Socket.off('userData', handleToGetUserData);
  //     Socket.off('undefined', switchOff);
  //     Socket.close();
  //   };
  // }, [setSocket]);

  return (
    <>
      <EntranceLobby.Provider value={{ showAuthorization, setShowAuthorization, socketFormData, setSocketFormData }}>
        {showAuthorization && < Authorization />}
        {!showAuthorization && <Lobby />}
      </EntranceLobby.Provider >
    </>
  )
}

export default App
