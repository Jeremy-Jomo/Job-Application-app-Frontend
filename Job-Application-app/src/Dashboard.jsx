import React, { useEffect, useState } from "react";

function Dashboard(){
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetch("https://jobconnect-zjzn.onrender.com/applications")
        .then((res) => res.json())
        .then((data) => setApplications(data))
        .catch((err) => console.error("Error fetching application", err));
    }, []);

    const totalApplications = applications.length;
    const pending = applications.filter(app => app.status === "pending").length;
    const accepted = applications.filter(app => app.status === "accepted").length;
    const rejected = applications.filter(app => app.status === "rejected").length;

    return (
        <div className="container py-5">
          <h1 className="fw-bold mb-4 text-center">📊 Dashboard</h1>

          <div className="row g-4 mb-5">
            <h2>Overview</h2>
            <p>Total Applications: {totalApplications}</p>
            <p>Pending Reviews: {pending}</p>
            <p>Approved: {accepted}</p>
            <p>Rejected: {rejected}</p>
          </div>

          <div>
            <h2>Recent Applications</h2>
            {applications.slice(0, 5).map((app) => (
                <div key={app.id}>
                  <p><strong>Job:</strong> {app.title}</p>
                  <p><strong>Applicant:</strong> {app.username}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                  <hr />
                </div>
            ))}
          </div>
        </div>
    );
}

export default Dashboard;