import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import UserService from "../Services/UserService";
import { motion } from "framer-motion";

const Signup = ({ setIsLoggedIn, isLoggedIn, isSidebarOpen }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    password: "",
    confirmPassword: "",
    userType: "ROLE_USER", // Default user type set to 'ROLE_USER'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (formData.firstName.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters long";
    }
    if (formData.lastName.trim().length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters long";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.phoneNo && formData.phoneNo.length < 10) {
      newErrors.phoneNo = "Phone number must be at least 10 digits long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (validateForm()) {
      let user = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        address: formData.address,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.userType,
      };
      console.log(user);
      try {
        setLoading(true);
        await UserService.sendOtp(user.email);
        setLoading(false);
        navigate("/sendOtp", {
          state: { User: user, newuser: true },
        });
      } catch (error) {
        setLoading(false);
        console.error("OTP send failed:", error);
        alert("Failed to send OTP. Please try again.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
        marginLeft: isLoggedIn ? (isSidebarOpen ? "20px" : "70px") : "0px",
      }}
    >
      {loading ? (
        <div className="loader"></div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="card shadow p-4 mx-auto"
          style={{
            width: "420px",
            maxHeight: "85vh",
            overflowY: "auto",
            borderRadius: "12px",
            border: "none",
          }}
        >
          <h2 className="text-center mb-4 text-primary">Sign Up</h2>
          <form className="mt-3">
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter first name"
                required
              />
              {errors.firstName && (
                <div className="text-danger">{errors.firstName}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter last name"
                required
              />
              {errors.lastName && (
                <div className="text-danger">{errors.lastName}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter email"
                required
              />
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter phone number"
                required
              />
              {errors.phoneNo && (
                <div className="text-danger">{errors.phoneNo}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter address"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Create a password"
                required
              />
              {errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Confirm password"
                required
              />
              {errors.confirmPassword && (
                <div className="text-danger">{errors.confirmPassword}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">User Type</label>
              <div>
                <input
                  type="radio"
                  id="user"
                  name="userType"
                  value="ROLE_USER"
                  checked={formData.userType === "ROLE_USER"}
                  onChange={handleChange}
                />
                <label htmlFor="user" className="me-3">
                  User
                </label>
                <input
                  type="radio"
                  id="owner"
                  name="userType"
                  value="ROLE_OWNER"
                  checked={formData.userType === "ROLE_OWNER"}
                  onChange={handleChange}
                />
                <label htmlFor="owner">Owner</label>
              </div>
            </div>
            <button
              type="button"
              onClick={sendOtp}
              className="btn btn-primary w-100"
            >
              Send OTP
            </button>
          </form>
          <div className="text-center mt-3">
            <small>
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Signup;
