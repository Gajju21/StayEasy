import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../Services/UserService";

const SendOtp = ({ setIsLoggedIn, isLoggedIn, isSidebarOpen }) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.User || {};

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      await UserService.verifyOtp(user.email, parseInt(otp));

      if (location.state?.newuser) {
        if (user) {
          await UserService.postuser(user);
          sessionStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);
          navigate("/permission");
        } else {
          navigate("/signup");
        }
      } else {
        try {
          const response = await UserService.loginuser(user);
          sessionStorage.setItem("user_id", response.data.user_id);
          sessionStorage.setItem("role", response.data.role);
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("isLoggedIn", "true");

          setIsLoggedIn(true);
          navigate("/permission");
        } catch (e) {
          alert("Login failed. Please try again.");
          navigate("/login");
        }
      }
    } catch (e) {
      console.error("Error verifying OTP:", e);
      alert("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        marginLeft: isLoggedIn ? (isSidebarOpen ? "20px" : "70px") : "0px",
        maxWidth: "400px",
      }}
    >
      <h2 className="text-primary text-center">Verify OTP</h2>
      <p className="text-muted text-center">
        OTP sent to <strong>{user.email}</strong>
      </p>

      <input
        type="text"
        className="form-control mb-3 text-center"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        maxLength={6}
      />

      <button
        className="btn btn-success w-100"
        onClick={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default SendOtp;
