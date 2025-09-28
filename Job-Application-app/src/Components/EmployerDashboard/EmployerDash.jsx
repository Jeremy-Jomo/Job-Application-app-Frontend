// src/Components/EmployerDashboard/EmployerDash.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function EmployerDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

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
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Session check response:", data); // Debug log
        if (data.logged_in && data.user.role.toLowerCase() === "employer") {
          setUser(data.user);
          fetchEmployerJobs(data.user.id);
        } else if (
          data.logged_in &&
          data.user.role.toLowerCase() !== "employer"
        ) {
          setMessage("Access denied. This dashboard is for employers only.");
          setUser(null);
        } else {
          setMessage("You must be logged in to access this page.");
          setUser(null);
        }
      })
      .catch((err) => {
        console.error("Session check failed:", err);
        setMessage("Failed to load session. Please try logging in again.");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Fetch jobs
  const fetchEmployerJobs = async (employerId) => {
    try {
      console.log("Fetching jobs for employer:", employerId); // Debug log
      const res = await fetch("https://jobconnect-zjzn.onrender.com/jobs", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("All jobs response:", data); // Debug log

      const employerJobs = data.filter((job) => job.user_id === employerId);
      console.log("Employer jobs:", employerJobs); // Debug log

      setJobs(employerJobs);

      if (employerJobs.length > 0) {
        await fetchApplications();
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setMessage("Failed to load jobs. Please refresh the page.");
    }
  };

  // ✅ Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await fetch(
        "https://jobconnect-zjzn.onrender.com/applications",
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Applications response:", data); // Debug log
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setMessage("Failed to load applications.");
      setApplications([]);
    }
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
  const deleteJob = async (jobId) => {
    try {
      const res = await fetch(
        `https://jobconnect-zjzn.onrender.com/jobs/${jobId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setApplications((prev) => prev.filter((app) => app.job_id !== jobId));
      setMessage("Job deleted successfully.");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting job:", err);
      setMessage("Failed to delete job. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // ✅ Update application status
  const updateAppStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(
        `https://jobconnect-zjzn.onrender.com/applications/${appId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedApp = await res.json();
      setApplications((prev) =>
        prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );

      setMessage(`Application ${newStatus} successfully.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error updating application:", err);
      setMessage("Failed to update application status. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // ✅ Job validation
  const jobSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    description: Yup.string().required("Job description is required"),
    company: Yup.string().required("Company name is required"),
    location: Yup.string().required("Location is required"),
  });

  // ✅ Post new job
  const handleJobPost = async (values, { resetForm, setSubmitting }) => {
    if (!user) {
      setMessage("You must be logged in to post a job.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("https://jobconnect-zjzn.onrender.com/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setJobs((prev) => [...prev, data]);
      resetForm();
      setMessage("Job posted successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error posting job:", err);
      setMessage("Failed to post job. Please try again.");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You must be logged in as an employer to view this page.</p>
          <a href="/login" className="btn btn-primary">
            Go to Login
          </a>
        </div>
        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center mb-4 text-dark">
        Welcome, {user.username}!
      </h2>

      {message && (
        <div className="alert alert-info text-center py-2 mb-4">{message}</div>
      )}

      {/* ✅ Job Post Form */}
      <div
        className="card shadow-lg rounded-4 p-5 mx-auto mb-5"
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
        <h3 className="fw-bold mb-4">Your Posted Jobs ({jobs.length})</h3>
        {jobs.length > 0 ? (
          <div className="row mt-3">
            {jobs.map((job) => {
              const jobApplications = applications.filter(
                (app) => app.job_id === job.id
              );
              return (
                <div key={job.id} className="col-md-6 mb-4">
                  <div className="card shadow-sm rounded-4 p-3 h-100">
                    <h5 className="fw-bold">{job.title}</h5>
                    <p className="mb-1 text-muted">
                      <strong>{job.company}</strong> — {job.location}
                    </p>
                    <p className="small mb-3">{job.description}</p>

                    <div className="mb-3">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmAction("delete", job)}
                      >
                        Delete Job
                      </button>
                    </div>

                    {/* ✅ Applications */}
                    <div>
                      <h6 className="fw-bold">
                        Applications ({jobApplications.length})
                      </h6>
                      {jobApplications.length > 0 ? (
                        <div
                          className="applications-list"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {jobApplications.map((app) => (
                            <div
                              key={app.id}
                              className="border rounded p-2 mb-2 bg-light"
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="flex-grow-1">
                                  <p className="mb-1 fw-semibold">
                                    {app.name || app.username || "Anonymous"}
                                  </p>
                                  {app.email && (
                                    <small className="text-muted d-block">
                                      {app.email}
                                    </small>
                                  )}
                                </div>
                                <span
                                  className={`badge ${
                                    app.status === "pending"
                                      ? "bg-warning text-dark"
                                      : app.status === "accepted"
                                      ? "bg-success"
                                      : "bg-danger"
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </div>

                              {app.cover_letter && (
                                <p className="small text-muted mb-2">
                                  <strong>Cover Letter:</strong>{" "}
                                  {app.cover_letter.substring(0, 100)}
                                  {app.cover_letter.length > 100 && "..."}
                                </p>
                              )}

                              {app.status === "pending" && (
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      confirmAction("accept", null, app)
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      confirmAction("reject", null, app)
                                    }
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small">No applications yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-4">No jobs posted yet.</p>
            <p className="small text-muted">
              Use the form above to post your first job!
            </p>
          </div>
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
                    `Are you sure you want to delete the job "${selectedJob?.title}"? This action cannot be undone and will also delete all associated applications.`}
                  {modalAction === "accept" &&
                    `Are you sure you want to accept the application from ${
                      selectedApp?.name ||
                      selectedApp?.username ||
                      "this applicant"
                    }?`}
                  {modalAction === "reject" &&
                    `Are you sure you want to reject the application from ${
                      selectedApp?.name ||
                      selectedApp?.username ||
                      "this applicant"
                    }?`}
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
