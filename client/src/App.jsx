import React, { useState } from 'react'
import Authorization from './modules/authorization/Authorization';
import Lobby from './modules/game/controller'

export const EntranceLobby = React.createContext()
function App() {
  const [showAuthorization, setShowAuthorization] = useState(true);
  const [socketFormData, setSocketFormData] = useState('');
  const [userData, setUserData] = useState('');

  return (<><EntranceLobby.Provider value={{ userData, setUserData, showAuthorization, setShowAuthorization, socketFormData, setSocketFormData }}>
    {showAuthorization && < Authorization />}
    {!showAuthorization && <Lobby />}
  </EntranceLobby.Provider >
  </>)
}

export default App
