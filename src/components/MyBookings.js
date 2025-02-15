import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const MyBookings = ({ isSidebarOpen }) => {
  const [bookings, setBookings] = useState([]);
  const userId = sessionStorage.getItem("user_id"); // Get userId from localStorage

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/bookings/getuserbookings/${userId}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, [userId]);

  // Format date function
  const formatDateTime = (isoDate) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
      <h2 className="mb-4 text-center text-primary">My Bookings</h2>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.bookingId} className="col">
              <div className="card shadow-lg border-0 rounded">
                <div className="card-body">
                  <h4 className="card-title text-uppercase text-primary">
                    {booking.hostelName}
                  </h4>
                  <p className="text-muted">
                    <strong>Room:</strong> {booking.roomNumber}
                  </p>
                  <p>
                    <strong>Check-in:</strong> {formatDateTime(booking.checkin)}
                  </p>
                  <p>
                    <strong>Check-out:</strong>{" "}
                    {booking.checkout ? (
                      formatDateTime(booking.checkout)
                    ) : (
                      <span className="text-danger fw-bold">
                        Not Checked Out
                      </span>
                    )}
                  </p>
                  <p className="text-muted">
                    <strong>Booking Date:</strong>{" "}
                    {formatDateTime(booking.bookingDate)}
                  </p>
                  <p className="fw-bold">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        booking.bookStatus === "PENDING"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    >
                      {booking.bookStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
