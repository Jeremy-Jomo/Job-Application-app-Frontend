import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Jobs from "./jobs";
import Login from "./Components/LoginPage/Login";

import Dashboard from "./Dashboard";
import Details from "./Details";
import CreateAcc from "./Components/CreateAcc/CreateAcc";
import ApplyPage from "./ApplyPage";
import LandingPage from "./Components/LandingPage/LandingPage";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark p-4">
        <img
          src="/logo/image.jpg.jpg"
          alt="logo"
          style={{ height: "50px", width: "auto", marginRight: "10px" }}
        />
        <h1>JobConnect</h1>
        <Link to="/" className="btn btn-dark ms-3">
          Home
        </Link>
        <Link to="/jobs" className="btn btn-dark ms-3">
          Browse Jobs
        </Link>{" "}
        {/* ✅ now works */}
        <Link to="/dashboard" className="btn btn-dark ms-3">
          Dashboard
        </Link>
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
              <LandingPage />
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
