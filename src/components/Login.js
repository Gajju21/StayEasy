import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { motion } from "framer-motion";
import UserService from "../Services/UserService";

const Login = ({ setIsLoggedIn, isLoggedIn, isSidebarOpen }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Enter a valid email address");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const validateForm = () => validateEmail() && validatePassword();

  const submitHandler = async () => {
    if (!validateForm()) {
      alert("Invalid input");
      return;
    }

    try {
      setLoading(true);
      const response = await UserService.sendOtp(formData.email);

      if (response) {
        setLoading(false);
        navigate("/sendOtp", {
          state: { User: formData, newuser: false },
        });
      } else {
        throw new Error("OTP sending failed");
      }
    } catch (error) {
      console.error("Error while sending OTP:", error);
      alert("Error while sending OTP. Please try again.");
      navigate("/login"); // Only navigate to login if OTP fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 p-0"
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
          transition={{ duration: 0.5 }}
          className="card shadow p-4 mx-auto"
          style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}
        >
          <h2 className="text-center mb-4 text-primary">Login</h2>
          <form>
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
                placeholder="Enter your password"
                required
              />
            </div>
            <motion.button
              type="button"
              onClick={submitHandler}
              className="btn btn-primary w-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </form>
          <div className="text-center mt-3">
            <small>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </small>
            <br />
            <small>
              <Link to="/forgot_password">Forgot Password?</Link>
            </small>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
