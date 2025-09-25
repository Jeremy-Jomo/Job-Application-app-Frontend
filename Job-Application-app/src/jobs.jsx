import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs
    fetch("http://127.0.0.1:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs.", err));
  }, []);

  return (
    <div>
      <p>WELCOME!!!</p>
      <p>Browse the latest job opportunities.</p>

      {/* Fallback message if no jobs */}
      {jobs.length === 0 && <p>No jobs available at the moment.</p>}

      <div>
        {jobs.map((job) => (
          <div key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.description}</p>

            {/* ✅ Link to job details */}
            <Link to={`/jobs/${job.id}`}>
              <button>View Details</button>
            </Link>

            <Link to={`/jobs/${job.id}/apply`}>
            <button>Apply Now</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
