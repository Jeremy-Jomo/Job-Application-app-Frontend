import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

function Login({ setUser }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    fetch("https://jobconnect-zjzn.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔑 keep session cookie
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // ✅ Save user in React state immediately
          setUser(data.user);
          console.log("User after login:", data.user);

          // ✅ Redirect based on role
          if (data.user.role.toLowerCase() === "employer") {
            navigate("/dashboard-employer");
          } else {
            navigate("/dashboard-jobseeker");
          }
        } else {
          setMessage(data.message || "Login failed");
        }
      })
      .catch(() => setMessage("Something went wrong"))
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      className="card shadow-lg rounded-4 p-5 mx-auto mt-2"
      style={{
        maxWidth: "500px",
        width: "100%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="container mt-5">
        <h1 className="mb-4 fw-bold text-dark text-center">Welcome Back</h1>
        <h3 className="mb-4 fs-5 text-muted text-center">
          Sign in to your account
        </h3>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Username field */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="form-label text-dark fw-semibold"
                >
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="form-control"
                  placeholder="Enter your username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-danger"
                />
              </div>

              {/* Password field */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-dark w-100 mb-4 mt-4 py-2 fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {/* Register link */}
              <p>
                Don’t have an account?{" "}
                <Link to="/register" className="text-dark fw-bold">
                  Create Account
                </Link>
              </p>

              {/* Message */}
              {message && (
                <div className="alert alert-info mt-3">{message}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
