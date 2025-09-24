import { useState } from 'react'
import './App.css'
import Home from "./home"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <p>JobApp</p>
        <button>Sign Up</button>
        <button>LogIn</button>
        <button>👤</button>
        <hr />
      </nav>
      <Home />
    </>
  )
}

export default App
