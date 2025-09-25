import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs
    fetch("http://127.0.0.1:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data) || console.log(data))
      .catch((err) => console.error("Error fetching jobs.", err));
  }, []);

  return (
    <div>
      <h1>WELCOME!!!</h1>
      <p>Browse the latest job opportunities.</p>

      {/* Fallback message if no jobs */}
      {jobs.length === 0 && <p>No jobs available at the moment.</p>}

      <div className="container mt-4">
        <div className="row ">
          <div>
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card shadow-lg rounded-4 p-5 mx-auto mt-2"
                style={{
                  maxWidth: "500px",
                  width: "100%",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <h2 className="mb-3 text-center">{job.title}</h2>
                <p className="mb-3 ">
                  💼<strong>Company:</strong> {job.company}
                </p>
                <p>
                  📍 <strong>Location:</strong> {job.location}
                </p>
                <p>
                  🖃 <strong>Description:</strong>
                  {job.description}
                </p>

                {/* ✅ Link to job details */}
                <Link to={`/jobs/${job.id}`} className="btn btn-dark mb-4 me-2">
                  View Details
                </Link>

                <button className="btn btn-dark ">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
