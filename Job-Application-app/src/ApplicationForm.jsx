import React, { useState, useEffect } from "react";

function ApplicationForm({ jobId }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // ✅ Fetch logged-in user info
  useEffect(() => {
    fetch("https://jobconnect-zjzn.onrender.com/check-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.logged_in) {
          setUser(data.user);
          setName(data.user.username || "");
          setEmail(data.user.email || "");
        }
      })
      .catch((err) => console.error("Failed to load user info:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to apply.");

    fetch("https://jobconnect-zjzn.onrender.com/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        job_id: jobId,
        user_id: user.id,
        name,
        email,
        cover_letter: coverLetter,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Application created:", data);
        setCoverLetter("");
        alert("Application submitted successfully!");
      })
      .catch((err) => console.error("❌ Error submitting application:", err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card shadow-lg rounded-4 p-5 mx-auto mt-4"
      style={{ maxWidth: "600px", fontFamily: "Inter, sans-serif" }}
    >
      <h2 className="mb-4 text-center fw-bold">Apply for this Job</h2>

      <div className="mb-3">
        <label className="form-label fw-bold">Full Name</label>
        <input
          type="text"
          className="form-control rounded-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Email</label>
        <input
          type="email"
          className="form-control rounded-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Cover Letter</label>
        <textarea
          className="form-control rounded-3"
          rows="5"
          placeholder="Write your cover letter..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="btn btn-dark w-100 fw-bold py-2 rounded-3"
      >
        Submit Application
      </button>
    </form>
  );
}

export default ApplicationForm;
