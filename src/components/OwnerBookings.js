import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Button, Container, Row, Col } from "react-bootstrap";

const OwnerBookings = ({ isSidebarOpen }) => {
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const ownerId = sessionStorage.getItem("user_id");

  useEffect(() => {
    // Fetch hostels owned by this owner
    axios
      .get(`http://localhost:8080/api/hostels/hostelIds/${ownerId}`)
      .then((response) => {
        setHostels(response.data);
        if (response.data.length === 1) {
          fetchBookings(response.data[0]); // Auto-fetch if one hostel
        }
      })
      .catch((error) => console.error("Error fetching hostels:", error));
  }, [ownerId]);

  const fetchBookings = (hostelId) => {
    setSelectedHostel(hostelId);
    axios
      .get(`http://localhost:8080/api/bookings/hostel/${hostelId}`)
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  };

  const handleApprove = (bookingId) => {
    axios
      .put(`http://localhost:8080/api/bookings/approve/${bookingId}`)
      .then(() => fetchBookings(selectedHostel))
      .catch((error) => console.error("Error approving booking:", error));
  };

  const handleReject = (bookingId) => {
    axios
      .put(`http://localhost:8080/api/bookings/reject/${bookingId}`)
      .then(() => fetchBookings(selectedHostel))
      .catch((error) => console.error("Error rejecting booking:", error));
  };

  // Categorizing bookings
  const confirmedBookings = bookings.filter(
    (b) => b.bookStatus === "CONFIRMED"
  );
  const pendingBookings = bookings.filter((b) => b.bookStatus === "PENDING");
  const canceledBookings = bookings.filter((b) => b.bookStatus === "CANCELED");

  return (
    <Container
      className="mt-4"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "60px", // Prevent overlap
        padding: "20px",
        transition: "margin-left 0.3s ease-in-out",
        width: "1000px",
      }}
    >
      <h2 className="text-center">Owner Bookings</h2>

      {hostels.length > 1 && (
        <div className="mb-3 text-center">
          <h4>Select a Hostel</h4>
          {hostels.map((id) => (
            <Button key={id} className="m-2" onClick={() => fetchBookings(id)}>
              Hostel {id}
            </Button>
          ))}
        </div>
      )}

      {selectedHostel && (
        <h3 className="text-center mt-3">
          Bookings for Hostel {selectedHostel}
        </h3>
      )}

      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <Row className="mt-4">
          {/* Confirmed Bookings */}
          <Col md={4}>
            <h4 className="text-success text-center">Confirmed</h4>
            {confirmedBookings.map((booking) => (
              <Card
                key={booking.bookingId}
                className="mb-3 shadow-lg animate__animated animate__fadeIn"
              >
                <CardBody>
                  <h5>
                    {booking.username} - Room {booking.roomNumber}
                  </h5>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(booking.checkin).toLocaleString()}
                  </p>
                  <p className="text-success fw-bold">✔ Confirmed</p>
                </CardBody>
              </Card>
            ))}
          </Col>

          {/* Pending Bookings */}
          <Col md={4}>
            <h4 className="text-warning text-center">Pending</h4>
            {pendingBookings.map((booking) => (
              <Card
                key={booking.bookingId}
                className="mb-3 shadow-lg animate__animated animate__fadeIn"
              >
                <CardBody>
                  <h5>
                    {booking.username} - Room {booking.roomNumber}
                  </h5>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(booking.checkin).toLocaleString()}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Button
                      className="btn-success"
                      onClick={() => handleApprove(booking.bookingId)}
                    >
                      Approve
                    </Button>
                    <Button
                      className="btn-danger"
                      onClick={() => handleReject(booking.bookingId)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </Col>

          {/* Canceled Bookings */}
          <Col md={4}>
            <h4 className="text-danger text-center">Canceled</h4>
            {canceledBookings.map((booking) => (
              <Card
                key={booking.bookingId}
                className="mb-3 shadow-lg animate__animated animate__fadeIn"
              >
                <CardBody>
                  <h5>
                    {booking.username} - Room {booking.roomNumber}
                  </h5>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(booking.checkin).toLocaleString()}
                  </p>
                  <p className="text-danger fw-bold">✘ Canceled</p>
                </CardBody>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OwnerBookings;
