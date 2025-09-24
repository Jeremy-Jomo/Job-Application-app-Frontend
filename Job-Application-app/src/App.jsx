import { useState } from 'react'
import './App.css'
import Home from "./home"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <p>JobConnect</p>
        <a href="">Browse Courses</a>
        <a href="">Dashboard</a>
        <button>Sign In</button>
        <hr />

        <div>
          <h1>Connect Talent with Opprtunity</h1>
          <p>Whether you,re seeking your dream job or looking to hire the best talent, JobConnect makes meaningful connections happen.</p>
        </div>

        <div>
          <h1>Why Choose JobConnect?</h1>
          <p>Our platform brings together the best features for bothh job seekers and employers.</p>
        </div>

        <div>
          <h1>Ready to Get Started?</h1>
          <p>Join thousands of job seekers and employers who have found success on our platform.</p>
          <button>Sign Up as Job Seeker</button>
          <button>Post Your First Job</button>
        </div>
      </nav>
      {/* <Home /> */}
    </>
  )
}

export default App
