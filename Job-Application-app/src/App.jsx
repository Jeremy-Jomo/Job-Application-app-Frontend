// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Jobs from "./jobs";
import Login from "./Components/LoginPage/Login";
import Dashboard from "./Dashboard";
import Details from "./Details";
import CreateAcc from "./Components/CreateAcc/CreateAcc";
import ApplyPage from "./ApplyPage";
import LandingPage from "./Components/LandingPage/LandingPage";
import EmployerDashboard from "./Components/EmployerDashboard/EmployerDash";
import JobseekerDashboard from "./Components/JobseekerDashboard/Jobseeker";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Check session when app mounts
  useEffect(() => {
    fetch("https://jobconnect-zjzn.onrender.com/check-session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) {
          setUser(data.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    fetch("https://jobconnect-zjzn.onrender.com/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        window.location.href = "/login"; // redirect
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <Router>
      {/* ✅ Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark p-4 bg-dark">
        <img
          src="/logo/image.jpg.jpg"
          alt="logo"
          style={{ height: "50px", width: "auto", marginRight: "10px" }}
        />
        <h1 className="text-white">JobConnect</h1>

        <div className="ms-auto">
          <Link to="/" className="btn btn-outline-light ms-3">
            Home
          </Link>
          <Link to="/jobs" className="btn btn-outline-light ms-3">
            Browse Jobs
          </Link>
          {user?.role?.toLowerCase() === "jobseeker" && (
            <Link
              to="/dashboard-jobseeker"
              className="btn btn-outline-light ms-3"
            >
              Dashboard
            </Link>
          )}
          {user?.role?.toLowerCase() === "employer" && (
            <Link
              to="/dashboard-employer"
              className="btn btn-outline-light ms-3"
            >
              Employer Dashboard
            </Link>
          )}
          {!user ? (
            <>
              <Link to="/login" className="btn btn-warning ms-3">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-light ms-3">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-danger ms-3">
              Logout
            </button>
          )}
        </div>
      </nav>

      <hr />
      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/dashboard-jobseeker" element={<JobseekerDashboard />} />
        <Route path="/jobs/:id" element={<Details />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/jobs/:id/apply" element={<ApplyPage />} />
        <Route path="/register" element={<CreateAcc />} />
        <Route path="/dashboard-employer" element={<EmployerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
