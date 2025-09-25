import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Jobs from "./jobs";
import Login from "./Components/LoginPage/Login";

import Dashboard from "./Dashboard";
import Details from "./Details";
import CreateAcc from "./Components/CreateAcc/CreateAcc";
import ApplyPage from "./ApplyPage";

function App() {
  return (
    <Router>
      <nav>
        <p>JobConnect</p>
        <Link to="/jobs">Browse Jobs</Link> {/* ✅ now works */}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login" className="btn btn-dark ms-3">
          Sign In
        </Link>
      </nav>

      <hr />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div>
                <h1>Connect Talent with Opportunity</h1>
                <p>
                  Whether you're seeking your dream job or looking to hire the
                  best talent, JobConnect makes meaningful connections happen.
                </p>
              </div>

              <div>
                <h1>Why Choose JobConnect?</h1>
                <p>
                  Our platform brings together the best features for both job
                  seekers and employers.
                </p>
              </div>

              <div>
                <h1>Ready to Get Started?</h1>
                <p>
                  Join thousands of job seekers and employers who have found
                  success on our platform.
                </p>
                <button>Sign Up as Job Seeker</button>
                <button>Post Your First Job</button>
              </div>
            </>
          }
        />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs/:id" element={<Details />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs/:id/apply" element={<ApplyPage />} />
        <Route path="/register" element={<CreateAcc />}></Route>
        <Route />
      </Routes>
    </Router>
  );
}

export default App;
