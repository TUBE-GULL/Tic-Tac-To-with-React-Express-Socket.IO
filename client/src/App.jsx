import { useState } from 'react'
import Authorization from './modules/authorization/Authorization';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Authorization />
    </>
  )
}

export default App
