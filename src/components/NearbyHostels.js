import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const NearbyHostels = ({ userLocation }) => {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    if (userLocation) {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=5000&type=lodging&key=AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc`
      )
        .then((response) => response.json())
        .then((data) => setHostels(data.results))
        .catch((error) => console.error("Error fetching hostels:", error));
    }
  }, [userLocation]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Nearby Hostels</h2>
      <div className="row">
        {hostels.map((hostel) => (
          <div className="col-md-4 mb-4" key={hostel.place_id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{hostel.name}</h5>
                <p className="card-text">{hostel.vicinity}</p>
                <button className="btn btn-primary">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyHostels;
