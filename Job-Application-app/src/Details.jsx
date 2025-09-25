// src/Details.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Details() {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch the job details from backend (replace URL with your API)
    fetch(`http://localhost:5000/jobs/${id}`)
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
        <img src={job.companyLogo} alt={job.company} width={50} />
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
      </div>

      {/* Job Description */}
      <div className="job-section">
        <h3>Job Description</h3>
        <p>{job.description}</p>
      </div>

      {/* Apply */}
      <div className="job-section">
        <h3>Apply for this position</h3>
        <button className="apply-btn">Apply Now</button>
      </div>

      {/* About Company */}
      <div className="job-section">
        <h3>About {job.company}</h3>
        <p>{job.company}</p>
        <p>{job.companyType}</p>
        <p>{job.companySize} employees</p>
        <p>{job.companyLocation}</p>
      </div>
    </div>
  );
}

export default Details;
