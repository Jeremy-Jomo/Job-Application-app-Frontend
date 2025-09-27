import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("https://jobconnect-zjzn.onrender.com/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data) || console.log(data))
      .catch((err) => console.error("Error fetching jobs.", err));
  }, []);

  return (
    <div>
      <p className="fw-bold mb-3 text-center">Browse the latest job opportunities.</p>

      {/* Fallback message if no jobs */}
      {jobs.length === 0 && <p>No jobs available at the moment.</p>}

      <div className="container mt-4">
        <div className="row g-4 align-items-stretch">
          {jobs.map((job) => (
            <div key={job.id} className="col-md-6 d-flex">
              <div
                className="card shadow-lg rounded-4 p-4 flex-fill"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <h2 className="mb-3 text-center ">{job.title}</h2>

                <p className="mb-3 text-muted">
                  💼 <strong>Company:</strong> {job.company}
                </p>
                <p className="mb-3 text-muted ">
                  📍 <strong>Location:</strong> {job.location}
                </p>
                <p className="mb-3 text-muted">
                  📝 <strong>Description:</strong> {job.description}
                </p>

                <div className="mt-auto">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn btn-dark  mb-3 me-2"
                  >
                    View Details
                  </Link>
                  <Link to={`/jobs/${job.id}/apply`}>
                    <button className="btn btn-outline-dark">Apply Now</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
