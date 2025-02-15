import React, { useState, useEffect } from "react";
import axios from "axios";
import UserService from "../Services/UserService";

const Profile = ({ isSidebarOpen }) => {
  const [user, setUser] = useState({
    user_id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneno: "",

    role: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user details from backend
    const fetchUserData = async () => {
      try {
        const res = await UserService.getuser(
          sessionStorage.getItem("user_id")
        );
        setUser(res.data);
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:8080/auth/update/" +
          sessionStorage.getItem("user_id"),
        user
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div
      className="container mt-4"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "60px", // Prevent overlap
        padding: "20px",
        transition: "margin-left 0.3s ease-in-out",
        width: "1000px",
      }}
    >
      <h2>User Profile</h2>
      <div className="card p-3">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={user.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone No</label>
          <input
            type="text"
            className="form-control"
            name="phoneNo"
            value={user.phoneno}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-control"
            value={user.role}
            disabled
          />
        </div>

        <div className="d-flex justify-content-between">
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
