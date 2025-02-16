import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ProfileSidebar = ({ setIsSidebarOpen }) => {
  const [showsidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showsidebar);
    setIsSidebarOpen(!showsidebar); // Update the parent state to notify Navbar
  };

  return (
    <div
      style={{
        width: showsidebar ? "250px" : "60px",
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        background: "#f8f9fa",
        padding: "10px",
        transition: "width 0.3s ease-in-out",
        overflowX: "hidden", // Prevent horizontal scroll
        boxShadow: showsidebar ? "2px 0px 5px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="btn btn-light"
        style={{ marginBottom: "10px", display: "block" }}
      >
        ☰
      </button>

      {/* Sidebar Content */}
      {showsidebar && (
        <div>
          <h4>User Profile</h4>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>

            <Nav.Link as={Link} to="/search_hostel">
              Hostels
            </Nav.Link>
            <Nav.Link as={Link} to="/my-bookings">
              My Booking
            </Nav.Link>
            {sessionStorage.getItem("role") == "ROLE_OWNER" && (
              <>
                <Nav.Link as={Link} to="/manage-bookings">
                  Manage My Hostel booking
                </Nav.Link>
                <Nav.Link as={Link} to="/add_hostel">
                  Add your hostel
                </Nav.Link>
              </>
            )}
          </Nav>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;
