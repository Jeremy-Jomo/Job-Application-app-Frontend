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
<<<<<<< HEAD
        <img src={job.companyLogo} alt={job.company} width={50} />
        <div className="card">
          <div>
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>
              ${job.salaryMin} - ${job.salaryMax}
            </p>
            <p>Posted: {job.postedDate}</p>
          </div>
          <span className="badge">{job.type}</span>
=======
        <div>
          <h2>{job.title}</h2>
          <p><strong>Company Name:</strong>{job.company}</p>
          <p><strong>Location:</strong>{job.location}</p>
>>>>>>> origin/main
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
<<<<<<< HEAD

      {/* About Company */}
      <div className="card">
        <div className="job-section">
          <h3>About {job.company}</h3>
          <p>{job.company}</p>
          <p>{job.companyType}</p>
          <p>{job.companySize} employees</p>
          <p>{job.companyLocation}</p>
        </div>
      </div>
=======
>>>>>>> origin/main
    </div>
  );
}

export default Details;
