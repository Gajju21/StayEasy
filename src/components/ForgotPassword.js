import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simulate sending OTP to the provided email.
    // Call your backend API here to send OTP to the user.
    console.log("Sending OTP to email: ", email);
    setIsOtpSent(true); // Mark OTP as sent.
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Simulate OTP verification.
    // Call your backend API to verify OTP.
    console.log("Verifying OTP: ", otp);
    if (otp === "123456") {
      // Simulate correct OTP.
      setIsOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        {!isOtpSent ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send OTP
            </button>
          </form>
        ) : !isOtpVerified ? (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Verify OTP
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h4>OTP Verified Successfully!</h4>
            <Link to="/reset-password">Go to Reset Password</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
