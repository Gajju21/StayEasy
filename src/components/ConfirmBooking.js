import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmBooking = ({ isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // State for check-in date and time
  const [checkinDate, setCheckinDate] = useState("");
  const [checkinTime, setCheckinTime] = useState("");

  const room = location.state?.room;
  const hostelId = parseInt(location.state?.hostelId);
  const roomId = parseInt(room.room_id);
  const userId = parseInt(sessionStorage.getItem("user_id"));
  console.log("in cnfmbok hosteelid " + hostelId);
  console.log("in cnfmbok roomId " + roomId);
  console.log("in cnfmbok userId " + userId);
  // Get room details from navigation state

  if (!room) {
    return (
      <p className="text-center text-danger">Error: No room details found!</p>
    );
  }

  const finalizeBooking = async () => {
    if (!checkinDate || !checkinTime) {
      alert("Please select both check-in date and time.");
      return;
    }

    // Combine date and time into a valid timestamp format
    const checkinTimestamp = `${checkinDate} ${checkinTime}:00`;

    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            room_id: roomId,
            user_id: userId, // Replace with actual logged-in user ID
            hostel_id: hostelId,
            checkin: checkinTimestamp, // Send combined date & time
            checkout: null, // Checkout remains null
          }),
        }
      );

      if (!response.ok) throw new Error("Booking failed!");

      alert("Booking Successful!");
      navigate("/my-bookings"); // Redirect after booking
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to book room!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "60px", // Prevent overlap
        padding: "20px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "450px" }}>
        <h2 className="text-center mb-5">Confirm Your Booking</h2>
        <h3 className="text-center">Room {room.roomNumber}</h3>
        <p className="text-center">
          <strong>Price:</strong> ₹{room.price} / month
        </p>
        <p className="text-center">
          <strong>Sharing:</strong> {room.sharing}-Person
        </p>
        <div className="mb-4">
          <label className="form-label">
            <strong>Check-in Date:</strong>
          </label>
          <input
            type="date"
            className="form-control"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            <strong>Check-in Time:</strong>
          </label>
          <input
            type="time"
            className="form-control"
            value={checkinTime}
            onChange={(e) => setCheckinTime(e.target.value)}
          />
        </div>
        <button className="btn btn-success w-100" onClick={finalizeBooking}>
          Confirm my Booking
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
