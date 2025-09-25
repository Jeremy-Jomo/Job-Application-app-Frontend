import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React from "react";

function CreateAcc() {
  const initialData = {
    username: "",
    email: "",
    password: "",
    role: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  function handleSubmit(values, { setSubmitting, resetForm, setErrors }) {
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) =>
        response.json().then((data) => ({ ok: response.ok, data }))
      )
      .then(({ ok, data }) => {
        if (ok && data.success) {
          alert("✅ Account created successfully!");
          resetForm();
        } else {
          setErrors({ email: data.message || "Registration failed" });
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setErrors({ email: data.message || "Registration failed" });
      })
      .finally(() => {
        setSubmitting(false); // re-enable button
      });
  }

  return (
    <>
      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="card shadow-lg rounded-4 p-5 mx-auto mt-2">
            <h1 className="mb-3 fw-bold">Create Account</h1>
            <h3 className="mb-4 fs-6 text-muted">Join our platform today</h3>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Username:
              </label>
              <Field
                type="text"
                name="username"
                className="form-control"
                id="username"
                placeholder="Enter your username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email:
              </label>
              <Field
                type="text"
                name="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label fw-bold">
                Role:
              </label>
              <Field
                as="select"
                name="role"
                id="role"
                className="form-select"
                required
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                Password:
              </label>
              <Field
                type="password"
                name="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label  fw-bold">
                Confirm Password:
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control"
                id="confirmPassword"
                placeholder="Re-enter your password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger"
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark w-100 mb-3 mt-4 py-2 fw-bold"
              disabled={isSubmitting}
            >
              Create Account
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
export default CreateAcc;
