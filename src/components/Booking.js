import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Booking.css"; // Import custom styling
import { useNavigate, useParams } from "react-router-dom"; // To get the hostel ID
import { LogIn } from "lucide-react";

const Booking = ({ isSidebarOpen }) => {
  const { hostelId } = useParams(); // Get hostel ID from URL
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("hostel id = " + hostelId);

  useEffect(() => {
    fetchRooms();
  }, [hostelId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/rooms/${hostelId}`
      );
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const bookRoom = (room) => {
  //     alert(`Room ${room.roomNumber} booked successfully!`);
  //     // TODO: Send booking request to backend
  //   };

  // Group rooms by sharing type
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.sharing]) {
      acc[room.sharing] = [];
    }
    acc[room.sharing].push(room);
    return acc;
  }, {});

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
      <h2 className="text-center mb-4">Available Rooms</h2>

      {loading ? (
        <p className="text-center">Loading rooms...</p>
      ) : (
        <div className="accordion" id="roomAccordion">
          {Object.keys(groupedRooms).map((sharing, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                >
                  {sharing}-Sharing Rooms
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#roomAccordion"
              >
                <div className="accordion-body">
                  <div className="row">
                    {groupedRooms[sharing].map((room) => (
                      <div className="col-md-4 mb-3" key={room.room_id}>
                        <div className="room-card">
                          <h5>Room {room.roomNumber}</h5>
                          <p>
                            <strong>Price:</strong> ₹{room.price} / month
                          </p>
                          <p>
                            <strong>Sharing:</strong> {room.sharing}-Person
                          </p>
                          <button
                            className="book-now"
                            onClick={() =>
                              navigate(`/confirm-booking/${room.room_id}`, {
                                state: { room, hostelId },
                              })
                            }
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;
