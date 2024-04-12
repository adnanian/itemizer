import { useState } from 'react'
import './App.css'
import SignUpOldWay from './oldcomponents/SignupOldWay'
import SignupFormikBasic from './oldcomponents/SignupFormikBasic'
import Signup from './components/Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Signup/>
  )
}

export default App
