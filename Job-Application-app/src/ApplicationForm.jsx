import React, { useState } from "react";

function ApplicationForm({ jobId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        name,
        email,
        cover_letter: coverLetter,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Application created:", data);
        alert("Application submitted successfully!");
        setName("");
        setEmail("");
        setCoverLetter("");
      })
      .catch((err) => console.error("❌ Error submitting application:", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply for this Job</h2>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Write your cover letter..."
        required
      />

      <button type="submit">Submit Application</button>
    </form>
  );
}

export default ApplicationForm;
