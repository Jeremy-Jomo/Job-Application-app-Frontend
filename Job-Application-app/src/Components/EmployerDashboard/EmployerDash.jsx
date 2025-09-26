// src/Components/EmployerDashboard/EmployerDash.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function EmployerDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  // ✅ Fetch logged-in user from session
  useEffect(() => {
    fetch("http://localhost:5000/check-session", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        if (data.logged_in && data.user.role.toLowerCase() === "employer") {
          setUser(data.user);
          fetchEmployerJobs(data.user.id);
        } else {
          alert("Unauthorized. Please log in as an employer.");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        alert("You must be logged in.");
        window.location.href = "/login";
      });
  }, []);

  // ✅ Fetch jobs posted by this employer
  const fetchEmployerJobs = (employerId) => {
    fetch("http://localhost:5000/jobs", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const employerJobs = data.filter((job) => job.user_id === employerId);
        setJobs(employerJobs);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  };

  // ✅ Validation schema
  const jobSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    description: Yup.string().required("Job description is required"),
    company: Yup.string().required("Company name is required"),
    location: Yup.string().required("Location is required"),
  });

  // ✅ Handle job post
  const handleJobPost = (values, { resetForm }) => {
    if (!user) return;

    fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...values, user_id: user.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to post job");
        return res.json();
      })
      .then((data) => {
        setJobs([...jobs, data]);
        resetForm();
      })
      .catch((err) => {
        console.error("Error posting job:", err);
        alert("Failed to post job");
      });
  };

  return (
    <div className="container mt-5">
      {user && (
        <h2 className="fw-bold text-center mb-4 text-dark">
          Welcome, {user.username}!
        </h2>
      )}

      {/* ✅ Post Job Form */}
      <div
        className="card shadow-lg rounded-4 p-5 mx-auto"
        style={{
          maxWidth: "600px",
          width: "100%",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h1 className="mb-4 fw-bold text-dark text-center">Post a Job</h1>
        <h3 className="mb-4 fs-5 text-muted text-center">
          Fill in the job details below
        </h3>

        <Formik
          initialValues={{
            title: "",
            description: "",
            company: "",
            location: "",
          }}
          validationSchema={jobSchema}
          onSubmit={handleJobPost}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="form-label text-dark fw-semibold"
                >
                  Job Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="form-control"
                  placeholder="Enter job title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="form-label text-dark fw-semibold"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  rows="3"
                  className="form-control"
                  placeholder="Enter job description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="company"
                  className="form-label text-dark fw-semibold"
                >
                  Company
                </label>
                <Field
                  type="text"
                  name="company"
                  id="company"
                  className="form-control"
                  placeholder="Enter company name"
                />
                <ErrorMessage
                  name="company"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="form-label text-dark fw-semibold"
                >
                  Location
                </label>
                <Field
                  type="text"
                  name="location"
                  id="location"
                  className="form-control"
                  placeholder="Enter job location"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-danger"
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 mb-4 mt-4 py-2 fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* ✅ Employer’s Jobs */}
      <div className="mt-5">
        <h3 className="fw-bold">Your Posted Jobs</h3>
        {jobs.length > 0 ? (
          <div className="row mt-3">
            {jobs.map((job) => (
              <div key={job.id} className="col-md-6 mb-4">
                <div className="card shadow-sm rounded-4 p-3 h-100">
                  <h5 className="fw-bold">{job.title}</h5>
                  <p className="mb-1 text-muted">
                    {job.company} — {job.location}
                  </p>
                  <p className="small">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
