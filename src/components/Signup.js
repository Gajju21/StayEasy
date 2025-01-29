import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "user", // Default to user
    phoneNo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here, including sending data to the backend
    // Depending on userType, you might save the user as an 'owner' or 'user' in the backend
    console.log(formData);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNo" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">User Type</label>
            <div>
              <input
                type="radio"
                id="user"
                name="userType"
                value="user"
                checked={formData.userType === "user"}
                onChange={handleChange}
              />
              <label htmlFor="user" className="me-3">
                User
              </label>

              <input
                type="radio"
                id="owner"
                name="userType"
                value="owner"
                checked={formData.userType === "owner"}
                onChange={handleChange}
              />
              <label htmlFor="owner">Owner</label>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;
