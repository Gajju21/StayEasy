import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 18.6498669, lng: 73.7808704 }; // Default Pune location

const SearchHostels = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Use API key from .env
  });

  const [hostels, setHostels] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          fetchHostelsByLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Location access denied. Enter a location manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Function to fetch hostels
  const fetchHostelsByLocation = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/hostels/search?location=${location}`
      );
      const data = await response.json();
      setHostels(data);
      if (data.length > 0) {
        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude });
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
    }
    setLoading(false);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchLocation.trim() !== "") {
      fetchHostelsByLocation(searchLocation);
    } else {
      alert("Please enter a valid location.");
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Search Hostels</h2>

      <div className="d-flex justify-content-center gap-2 mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-success" onClick={getUserLocation}>
          Use My Location
        </button>
      </div>

      {loading && <p>Loading hostels...</p>}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
      >
        {hostels.map((hostel) => (
          <Marker
            key={hostel.hostel_id}
            position={{ lat: hostel.latitude, lng: hostel.longitude }}
            title={hostel.hostelName}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default SearchHostels;
