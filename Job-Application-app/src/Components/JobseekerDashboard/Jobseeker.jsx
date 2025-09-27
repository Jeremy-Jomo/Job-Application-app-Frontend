import React, { useEffect, useState } from "react";

function JobseekerDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ✅ 1. Load logged-in user
  useEffect(() => {
    fetch("https://jobconnect-zjzn.onrender.com/check-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) setUser(data.user);
        else setUser(null);
      })
      .catch((err) => console.error("Session check failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ 2. Fetch applications with job info
  useEffect(() => {
    if (!user) return;

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `https://jobconnect-zjzn.onrender.com/users/${user.id}/applications`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, [user]);

  // ✅ 3. Withdraw an application
  const handleWithdraw = async (id) => {
    const removedApp = applications.find((app) => app.id === id);
    if (!removedApp) return;

    // Optimistic UI
    setApplications(applications.filter((app) => app.id !== id));
    setMessage(`Withdrawing "${removedApp.job?.title || "job"}"...`);

    try {
      const res = await fetch(`https://jobconnect-zjzn.onrender.com/applications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to withdraw");
      setMessage(
        `Application for "${removedApp.job?.title || "job"}" withdrawn.`
      );
    } catch (err) {
      console.error(err);
      setApplications((prev) => [...prev, removedApp]); // rollback
      setMessage("Failed to withdraw application.");
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <p className="text-center py-5">Loading dashboard...</p>;

  if (!user)
    return (
      <p className="text-center py-5 text-danger">
        You must be logged in to view this page.
      </p>
    );

  // ✅ Stats
  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-5 text-center text-primary">
        🎯 Jobseeker Dashboard
      </h1>

      {message && (
        <div className="alert alert-info text-center py-2 mb-4">{message}</div>
      )}

      {/* Overview cards */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 bg-light h-100">
            <div className="card-body">
              <h5 className="fw-bold">📂 Total</h5>
              <h2 className="fw-bold text-dark">{total}</h2>
              <p className="text-muted mb-0">Applications submitted</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 bg-warning-subtle h-100">
            <div className="card-body">
              <h5 className="fw-bold">⏳ Pending</h5>
              <h2 className="fw-bold text-warning">{pending}</h2>
              <p className="text-muted mb-0">Waiting for review</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 bg-success-subtle h-100">
            <div className="card-body">
              <h5 className="fw-bold">✅ Accepted</h5>
              <h2 className="fw-bold text-success">{accepted}</h2>
              <p className="text-muted mb-0">Approved applications</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-lg border-0 rounded-4 bg-danger-subtle h-100">
            <div className="card-body">
              <h5 className="fw-bold">❌ Rejected</h5>
              <h2 className="fw-bold text-danger">{rejected}</h2>
              <p className="text-muted mb-0">Declined applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="card shadow-lg border-0 rounded-4 mb-5">
        <div className="card-body">
          <h3 className="fw-bold mb-4">📌 My Applications</h3>

          {applications.length > 0 ? (
            <ul className="list-group list-group-flush">
              {applications.map((app) => (
                <li
                  key={app.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-3 px-3 border-0 rounded-3 shadow-sm mb-3"
                >
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">
                      {app.job?.title || "Job Title"}{" "}
                      <span className="text-muted">
                        @ {app.job?.company || "Company"}
                      </span>
                    </h6>
                    <small className="text-muted">
                      📍 {app.job?.location || "Location"}
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge px-3 py-2 fs-6 ${
                        app.status === "pending"
                          ? "bg-warning text-dark"
                          : app.status === "accepted"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {app.status}
                    </span>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleWithdraw(app.id)}
                    >
                      Withdraw
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobseekerDashboard;
