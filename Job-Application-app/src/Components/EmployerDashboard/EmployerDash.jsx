// src/Components/EmployerDashboard/EmployerDash.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function EmployerDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // ✅ Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // "delete" | "accept" | "reject"
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetch("https://jobconnect-zjzn.onrender.com/check-session", {
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

  // ✅ Fetch jobs
  const fetchEmployerJobs = (employerId) => {
    fetch("https://jobconnect-zjzn.onrender.com/jobs", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const employerJobs = data.filter((job) => job.user_id === employerId);
        setJobs(employerJobs);
        if (employerJobs.length > 0) fetchApplications();
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  };

  // ✅ Fetch applications
  const fetchApplications = () => {
    fetch("https://jobconnect-zjzn.onrender.com/applications", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error("Error fetching applications:", err));
  };

  // ✅ Open modal for actions
  const confirmAction = (action, job = null, app = null) => {
    setModalAction(action);
    setSelectedJob(job);
    setSelectedApp(app);
    setShowModal(true);
  };

  // ✅ Perform confirmed action
  const handleConfirm = () => {
    if (modalAction === "delete" && selectedJob) {
      deleteJob(selectedJob.id);
    } else if (
      (modalAction === "accept" || modalAction === "reject") &&
      selectedApp
    ) {
      updateAppStatus(
        selectedApp.id,
        modalAction === "accept" ? "accepted" : "rejected"
      );
    }

    setShowModal(false);
    setModalAction(null);
    setSelectedJob(null);
    setSelectedApp(null);
  };

  // ✅ Delete job
  const deleteJob = (jobId) => {
    fetch(`https://jobconnect-zjzn.onrender.com/jobs/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete job");
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        setApplications((prev) => prev.filter((app) => app.job_id !== jobId));
      })
      .catch((err) => console.error("Error deleting job:", err));
  };

  // ✅ Update application status
  const updateAppStatus = (appId, newStatus) => {
    fetch(`https://jobconnect-zjzn.onrender.com/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedApp) => {
        setApplications((prev) =>
          prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
        );
      })
      .catch((err) => console.error("Error updating application:", err));
  };

  // ✅ Job validation
  const jobSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    description: Yup.string().required("Job description is required"),
    company: Yup.string().required("Company name is required"),
    location: Yup.string().required("Location is required"),
  });

  // ✅ Post new job
  const handleJobPost = (values, { resetForm }) => {
    if (!user) return;

    fetch("https://jobconnect-zjzn.onrender.com/jobs", {
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

      {/* ✅ Job Post Form */}
      <div
        className="card shadow-lg rounded-4 p-5 mx-auto"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h1 className="mb-4 fw-bold text-dark text-center">Post a Job</h1>
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
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Job Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter job title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
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
              <div className="mb-3">
                <label htmlFor="company" className="form-label fw-semibold">
                  Company
                </label>
                <Field
                  type="text"
                  name="company"
                  className="form-control"
                  placeholder="Enter company name"
                />
                <ErrorMessage
                  name="company"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label fw-semibold">
                  Location
                </label>
                <Field
                  type="text"
                  name="location"
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
                className="btn btn-dark w-100 fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* ✅ Employer Jobs + Applications */}
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

                  <button
                    className="btn btn-sm btn-outline-danger mb-3"
                    onClick={() => confirmAction("delete", job)}
                  >
                    Delete Job
                  </button>

                  {/* ✅ Applications */}
                  <div>
                    <h6 className="fw-bold">Applications</h6>
                    {applications.filter((app) => app.job_id === job.id)
                      .length > 0 ? (
                      applications
                        .filter((app) => app.job_id === job.id)
                        .map((app) => (
                          <div
                            key={app.id}
                            className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                          >
                            <div>
                              <p className="mb-0 fw-semibold">{app.username}</p>
                              <small className="text-muted">
                                {app.cover_letter}
                              </small>
                            </div>
                            <div>
                              <span
                                className={`badge me-2 ${
                                  app.status === "pending"
                                    ? "bg-warning text-dark"
                                    : app.status === "accepted"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {app.status}
                              </span>
                              {app.status === "pending" && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success me-2"
                                    onClick={() =>
                                      confirmAction("accept", null, app)
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      confirmAction("reject", null, app)
                                    }
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted small">No applications yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No jobs posted yet.</p>
        )}
      </div>

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {modalAction === "delete"
                    ? "Confirm Delete"
                    : modalAction === "accept"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {modalAction === "delete" &&
                    `Are you sure you want to delete the job "${selectedJob?.title}"?`}
                  {modalAction === "accept" &&
                    `Are you sure you want to accept the application from ${selectedApp?.username}?`}
                  {modalAction === "reject" &&
                    `Are you sure you want to reject the application from ${selectedApp?.username}?`}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn ${
                    modalAction === "delete"
                      ? "btn-danger"
                      : modalAction === "accept"
                      ? "btn-success"
                      : "btn-danger"
                  }`}
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;
