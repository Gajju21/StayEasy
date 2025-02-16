import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HostelForm = ({ onSubmit, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerId: "12345", // Hidden field
    hostelName: "",
    address: "",
    latitude: "",
    longitude: "",
    roomTypes: [],
  });

  const [roomType, setRoomType] = useState({
    sharing: "",
    count: "",
    price: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prevData) => ({
          ...prevData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoomTypeChange = (e) => {
    const { name, value } = e.target;
    setRoomType({ ...roomType, [name]: value });
  };

  const addRoomType = () => {
    if (roomType.sharing && roomType.count && roomType.price) {
      setFormData({
        ...formData,
        roomTypes: [...formData.roomTypes, roomType],
      });
      setRoomType({ sharing: "", count: "", price: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let roomList = [];
    let roomNumber = 100; // Initial room number

    formData.roomTypes.forEach((rt) => {
      for (let i = 0; i < rt.count; i++) {
        roomList.push({
          roomNumber: (roomNumber++).toString(),
          sharing: parseInt(rt.sharing),
          price: parseFloat(rt.price),
          available: true,
        });
      }
    });

    const payload = {
      ownerId: sessionStorage.getItem("user_id"),
      hostelName: formData.hostelName,
      address: formData.address,
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      rooms: roomList,
    };

    // 🔥 Get token from localStorage
    const token = sessionStorage.getItem("token");
    console.log(token);

    try {
      const response = await fetch(
        "http://localhost:8080/api/hostels/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔥 Add token here
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Hostel added successfully!");
        navigate("/search_hostel");
      } else {
        alert("Failed to add hostel");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

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
      <Card className="p-4 shadow-sm">
        <h2 className="text-center mb-3">Add Hostel</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Control type="hidden" name="ownerId" value={formData.ownerId} />
          <Form.Control
            type="hidden"
            name="latitude"
            value={formData.latitude}
          />
          <Form.Control
            type="hidden"
            name="longitude"
            value={formData.longitude}
          />

          <Form.Group>
            <Form.Label>Hostel Name</Form.Label>
            <Form.Control
              type="text"
              name="hostelName"
              value={formData.hostelName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <h4 className="mt-4">Room Types</h4>
          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label>Sharing</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 2, 3"
                  name="sharing"
                  value={roomType.sharing}
                  onChange={handleRoomTypeChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Number of Rooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 5, 10"
                  name="count"
                  value={roomType.count}
                  onChange={handleRoomTypeChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Amount per Person</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 2000"
                  name="price"
                  value={roomType.price}
                  onChange={handleRoomTypeChange}
                />
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button variant="success" onClick={addRoomType}>
                Add
              </Button>
            </Col>
          </Row>

          <ul className="list-group mb-3">
            {formData.roomTypes.map((rt, index) => (
              <li key={index} className="list-group-item">
                {rt.count} rooms of {rt.sharing}-sharing at ₹{rt.price} each
              </li>
            ))}
          </ul>

          <Button variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default HostelForm;
