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
    <div className="job-details">
      <Link to="/jobs">⬅ Back to Jobs</Link>

      {/* Job Header */}
      <div className="job-header">
        <div>
          <h2>{job.title}</h2>
          <p>
            <strong>Company Name:</strong>
            {job.company}
          </p>
          <p>
            <strong>Location:</strong>
            {job.location}
          </p>
        </div>
      </div>

      {/* Job Description */}
      <div className="card">
        <div className="job-section">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>
      </div>
      {/* Apply */}
      <div className="card mb-3">
        <div className="job-section">
          <h3>Apply for this position</h3>
          <button className="btn btn-dark mb-3">Apply Now</button>
        </div>
      </div>
    </div>
  );
}

export default Details;
