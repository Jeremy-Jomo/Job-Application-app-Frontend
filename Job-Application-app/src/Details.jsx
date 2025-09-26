// src/Details.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Details() {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch the job details from backend (replace URL with your API)
    fetch(`http://127.0.0.1:5000/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((err) => console.error("Error fetching job details:", err));
  }, [id]);

  if (!job) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/jobs" className="text-decoration-none text-primary fw-bold">⬅ Back to Jobs</Link>
      </div>
      {/* Job Header */}
      <div className="card shadow-sm border-0 mb-4 rounded-4">
        <div className="card-body">
          <h2 className="fw-bold text-dark">{job.title}</h2>
          <p className="mb-1">
            <strong>Company Name:</strong>
            {job.company}
          </p>
          <p className="mb-1">
            <strong>Location:</strong>
            {job.location}
          </p>
        </div>
      </div>

      {/* Job Description */}
      <div className="card shadow-sm border-0 mb-4 rounded-4">
        <div className="card-body">
          <h3 className="fw-bold mb-3">Job Description</h3>
          <p className="text-muted">{job.description}</p>
        </div>
      </div>
      {/* Apply */}
      {/* <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body text-center">
          <h3 className="fw-bold mb-3">Apply for this position</h3>
          <button className="btn btn-primary btn-lg shadow-sm">Apply Now</button>
        </div>
      </div> */}
    </div>
  );
}

export default Details;
