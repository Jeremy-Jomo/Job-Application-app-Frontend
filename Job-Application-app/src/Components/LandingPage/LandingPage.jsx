import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Connect Talent with Opportunity</h1>
          <p className="lead text-muted mb-4">
            Whether you're seeking your dream job or looking to hire the best
            talent, <strong>JobConnect</strong> makes meaningful connections
            happen.
          </p>
          <a href="/dashboard" className="btn btn-dark btn-lg">
            Go to Dashboard
          </a>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Why Choose JobConnect?</h2>
          <p className="text-muted mb-5">
            Our platform brings together the best features for both job seekers
            and employers
          </p>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0 p-4">
                <div className="fs-1 mb-3">🔍</div>
                <h5 className="fw-bold">Smart Job Search</h5>
                <p className="text-muted">
                  Find relevant opportunities with our intelligent matching
                  system.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0 p-4">
                <div className="fs-1 mb-3">👥</div>
                <h5 className="fw-bold">Quality Candidates</h5>
                <p className="text-muted">
                  Connect with pre-screened, qualified professionals ready to
                  contribute.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0 p-4">
                <div className="fs-1 mb-3">📈</div>
                <h5 className="fw-bold">Career Growth</h5>
                <p className="text-muted">
                  Track your applications and career progress with detailed
                  analytics.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100 shadow-sm border-0 p-4">
                <div className="fs-1 mb-3">📦</div>
                <h5 className="fw-bold">Easy Posting</h5>
                <p className="text-muted">
                  Post jobs quickly and manage applications with our streamlined
                  tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="text-muted mb-4">
            Join thousands of job seekers and employers who have found success
            on our platform.
          </p>
          <a href="/login" className="btn btn-dark btn-lg me-2">
            Sign Up as Job Seeker
          </a>
          <a href="/login" className="btn btn-outline-dark btn-lg">
            Post Your First Job
          </a>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
