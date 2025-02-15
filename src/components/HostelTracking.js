import React, { useState, useEffect, useCallback } from "react";
import "../css/HostelSearch.css";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import _ from "lodash";
import { Container, Row, Col, Button, Form, ListGroup } from "react-bootstrap";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries = ["places"];

const HostelTracking = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc",
    libraries,
  });

  const [searchLocation, setSearchLocation] = useState("");
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [directions, setDirections] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          if (isNavigating && selectedHostel) {
            getDirections(selectedHostel);
          }
        },
        () => alert("Unable to retrieve your location."),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(id);
    }
  }, [isNavigating, selectedHostel]);

  const getDirections = (hostel) => {
    if (!userLocation) {
      alert("User location not available.");
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: hostel.latitude, lng: hostel.longitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setTravelInfo(result.routes[0].legs[0]);
        }
      }
    );
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    if (selectedHostel) getDirections(selectedHostel);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setDirections(null);
    setTravelInfo(null);
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <Container className="hostel-search-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {hostels.map((hostel) => (
          <Marker
            key={hostel.hostel_id}
            position={{ lat: hostel.latitude, lng: hostel.longitude }}
            onClick={() => setSelectedHostel(hostel)}
          />
        ))}
        {selectedHostel && (
          <InfoWindow
            position={{
              lat: selectedHostel.latitude,
              lng: selectedHostel.longitude,
            }}
            onCloseClick={() => setSelectedHostel(null)}
          >
            <div>
              <h5>{selectedHostel.hostelName}</h5>
              <p>{selectedHostel.address}</p>
              {!isNavigating ? (
                <Button onClick={handleStartNavigation}>Start</Button>
              ) : (
                <Button onClick={handleStopNavigation} variant="danger">
                  Stop
                </Button>
              )}
              {travelInfo && (
                <div>
                  <p>
                    <strong>Distance:</strong> {travelInfo.distance.text}
                  </p>
                  <p>
                    <strong>Time:</strong> {travelInfo.duration.text}
                  </p>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Container>
  );
};

export default HostelTracking;
