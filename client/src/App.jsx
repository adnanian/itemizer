import { useState } from 'react'
import './App.css'
import SignUpOldWay from './components/SignupOldWay'
import Signup from './components/Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Signup/>
  )
}

export default App
