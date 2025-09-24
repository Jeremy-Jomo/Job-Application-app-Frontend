import React, { useEffect, useState} from "react";

function Home() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        //Fetch jobs
        fetch("http://127.0.0.1:5000/jobs")
        .then((res) => res.json())
        .then((data) => setJobs(data))
        .catch((err) => console.error("Error fetching jobs.", err));
    }, []);

    return (
      <div>
        <p>WELCOME!!!</p>
        <p>Browse the latest job opprtunities.</p>

        {/* Fallback message if no jobs */}
      {jobs.length === 0 && <p>No jobs available at the moment.</p>}

        <div>
          {jobs.map((job) => (
            <div key={job.id}>
              <h2>{job.title}</h2>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <p>{job.description}</p>

              <button>View Details</button>
              <button>Apply Now</button>
            </div>
          ))}
        </div>

      </div>
    );
}

export default Home;