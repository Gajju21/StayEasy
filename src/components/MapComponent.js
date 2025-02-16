import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";

const MapComponent = ({ selectedHostel }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [eta, setEta] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Get initial user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location", error)
      );
    }
  }, []);

  const startNavigation = () => {
    if (!selectedHostel || !userLocation) return;

    setIsNavigating(true);

    // Track user movement in real-time
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        updateDirections(newLocation, selectedHostel);
      },
      (error) => console.error("Error tracking location", error),
      { enableHighAccuracy: true }
    );

    setWatchId(id);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setDirections(null);
    setDistance(null);
    setEta(null);
  };

  const updateDirections = (currentLocation, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination: { lat: destination.latitude, lng: destination.longitude },
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.text);
          setEta(route.duration.text);
        }
      }
    );
  };

  return (
    <div>
      <button onClick={startNavigation} disabled={isNavigating}>
        Start Navigation
      </button>
      <button onClick={stopNavigation} disabled={!isNavigating}>
        Stop Navigation
      </button>

      <div>Distance: {distance}</div>
      <div>ETA: {eta}</div>

      <GoogleMap
        center={userLocation || { lat: 18.6498, lng: 73.7808 }}
        zoom={15}
        onLoad={(map) => setMap(map)}
        mapContainerStyle={{ width: "100%", height: "500px" }}
      >
        {userLocation && <Marker position={userLocation} />}
        {selectedHostel && (
          <Marker
            position={{
              lat: selectedHostel.latitude,
              lng: selectedHostel.longitude,
            }}
          />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ polylineOptions: { strokeColor: "#1E3A8A" } }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;

// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   Marker,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import "bootstrap/dist/css/bootstrap.min.css";

// const containerStyle = {
//   width: "100%",
//   height: "500px",
//   borderRadius: "10px",
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
// };

// const center = {
//   lat: 18.5204, // Default to Pune
//   lng: 73.8567,
// };

// const MapsComponent = () => {
//   const [map, setMap] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });

//         // Fetch directions to a sample destination (adjust as needed)
//         const directionsService = new window.google.maps.DirectionsService();
//         directionsService.route(
//           {
//             origin: {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             },
//             destination: { lat: 18.5314, lng: 73.8446 }, // Sample destination
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === window.google.maps.DirectionsStatus.OK) {
//               setDirections(result);
//             } else {
//               console.error("Error fetching directions:", status);
//             }
//             setLoading(false);
//           }
//         );
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//         setLoading(false);
//       }
//     );
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">StayEasy - Route Navigation</h2>
//       {loading ? (
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status"></div>
//           <p>Loading Map...</p>
//         </div>
//       ) : (
//         <LoadScript googleMapsApiKey="AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc">
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={userLocation || center}
//             zoom={14}
//             onLoad={(map) => setMap(map)}
//           >
//             {userLocation && <Marker position={userLocation} label="You" />}
//             {directions && (
//               <DirectionsRenderer
//                 directions={directions}
//                 options={{
//                   polylineOptions: {
//                     strokeColor: "#0033cc", // Dark Blue Color
//                     strokeOpacity: 0.8,
//                     strokeWeight: 6,
//                   },
//                 }}
//               />
//             )}
//           </GoogleMap>
//         </LoadScript>
//       )}
//     </div>
//   );
// };

// export default MapsComponent;

// import React from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// const containerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const MapComponent = ({ userLocation }) => {
//   return (
//     <LoadScript googleMapsApiKey="AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc">
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={userLocation || { lat: 28.7041, lng: 77.1025 }}
//         zoom={14}
//       >
//         {userLocation && <Marker position={userLocation} />}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MapComponent;
