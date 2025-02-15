import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const LocationPermission = ({ isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleAllowLocation = () => {
    console.log("handle allow function ");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position ");
          const { latitude, longitude } = position.coords;
          console.log("after lat long ");
          //setUserLocation({ lat: latitude, lng: longitude });
          navigate("/search_hostel", {
            state: { location: { latitude, longitude } },
          }); // Redirect to hostel search page
        },
        (error) => {
          console.error("Error getting location: ", error);
          // Optionally, you can show an error message to the user.
        }
      );
    }
  };

  const handleDenyLocation = () => {
    alert("Location permission denied");
    // Optionally, navigate the user to another page or show a message.
  };

  return (
    <div
      className="container"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "60px", // Prevent overlap
        padding: "20px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <h2>Allow Location Access</h2>
      <p>
        We need your location to show nearby hostels. Please allow location
        access.
      </p>
      <button onClick={handleAllowLocation} className="btn btn-primary">
        Allow Location
      </button>
      <button onClick={handleDenyLocation} className="btn btn-danger ml-2">
        Deny Location
      </button>
    </div>
  );
};

export default LocationPermission;
