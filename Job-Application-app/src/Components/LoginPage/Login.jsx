import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login() {
  // Validation schema with Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle form submission with fetch
  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    fetch("http://localhost:5000/login", {
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
          alert("✅ Login successful!");
          // Example: save token or redirect
          // localStorage.setItem("token", data.token);
          // window.location.href = "/dashboard";
          resetForm();
        } else {
          setErrors({ password: "Invalid username or password" });
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setErrors({ password: "Something went wrong" });
      })
      .finally(() => {
        setSubmitting(false); // ✅ re-enable button
      });
  };

  return (
    <div
      className="card shadow-lg rounded-4 p-5 mx-auto mt-2 "
      style={{
        maxWidth: "500px",
        width: "100%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="container mt-5">
        <h1 className="mb-4 fw-bold text-dark ">Welcome Back</h1>
        <h3 className="mb-4 fs-5 text-muted">sign in to your account</h3>

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

              {/* Password field */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
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

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-dark w-100 mb-4 mt-4 py-2 fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
