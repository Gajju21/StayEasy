// import React, { useState, useEffect, useCallback } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";
// import _ from "lodash";
// import { Container, Row, Col, Button, Form, ListGroup } from "react-bootstrap";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc",
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [searchedLocation, setSearchedLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
//   const [directions, setDirections] = useState(null);
//   const [travelInfo, setTravelInfo] = useState(null);
//   const [isNavigating, setIsNavigating] = useState(false);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       const id = navigator.geolocation.watchPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location);
//           if (isNavigating) {
//             fetchNearbyHostels(location);
//             if (selectedHostel) {
//               getDirections(selectedHostel);
//             }
//           }
//         },
//         () => alert("Unable to retrieve your location."),
//         { enableHighAccuracy: true }
//       );
//       return () => navigator.geolocation.clearWatch(id);
//     }
//   }, [isNavigating, selectedHostel]);

//   const fetchNearbyHostels = useCallback(
//     _.throttle(async (location) => {
//       if (!location) return;
//       try {
//         const response = await axios.get(
//           "http://localhost:8080/api/hostels/nearby",
//           {
//             params: { latitude: location.lat, longitude: location.lng },
//           }
//         );
//         setHostels(response.data);
//       } catch (error) {
//         console.error("Error fetching nearby hostels:", error);
//       }
//     }, 10000),
//     []
//   );

//   const handleSearch = async () => {
//     try {
//       const geocoder = new window.google.maps.Geocoder();
//       geocoder.geocode({ address: searchLocation }, (results, status) => {
//         if (status === "OK" && results[0]) {
//           const location = results[0].geometry.location;
//           const formattedLocation = {
//             lat: location.lat(),
//             lng: location.lng(),
//           };
//           setSearchedLocation(formattedLocation);
//           setMapCenter(formattedLocation);
//         }
//       });
//       const response = await axios.get(
//         "http://localhost:8080/api/hostels/search",
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation?.lat,
//             userLng: userLocation?.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error searching hostels:", error);
//     }
//   };

//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//           setTravelInfo(result.routes[0].legs[0]);
//         }
//       }
//     );
//   };

//   const handleStartNavigation = () => {
//     setIsNavigating(true);
//     if (selectedHostel) getDirections(selectedHostel);
//   };

//   const handleStopNavigation = () => {
//     setIsNavigating(false);
//     setDirections(null);
//     setTravelInfo(null);
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <Container className="hostel-search-container">
//       <Row className="mb-3">
//         <Col md={8}>
//           <Form.Control
//             type="text"
//             placeholder="Enter location"
//             value={searchLocation}
//             onChange={(e) => setSearchLocation(e.target.value)}
//           />
//         </Col>
//         <Col md={2}>
//           <Button onClick={handleSearch}>Search</Button>
//         </Col>
//         <Col md={2}>
//           <Button onClick={() => fetchNearbyHostels(userLocation)}>
//             Nearby Hostels
//           </Button>
//         </Col>
//       </Row>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//       >
//         {userLocation && <Marker position={userLocation} label="You" />}
//         {searchedLocation && (
//           <Marker position={searchedLocation} label="" />
//         )}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h5>{selectedHostel.hostelName}</h5>
//               <p>{selectedHostel.address}</p>
//               <Button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </Button>
//               {travelInfo && (
//                 <div>
//                   <p>
//                     <strong>Distance:</strong> {travelInfo.distance.text}
//                   </p>
//                   <p>
//                     <strong>Time:</strong> {travelInfo.duration.text}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//         {directions && (
//           <DirectionsRenderer
//             directions={directions}
//             options={{
//               polylineOptions: {
//                 strokeColor: "#00008B",
//                 strokeOpacity: 1,
//                 strokeWeight: 4,
//               },
//             }}
//           />
//         )}
//       </GoogleMap>
//       <ListGroup className="mt-3">
//         {hostels.map((hostel) => (
//           <ListGroup.Item
//             key={hostel.hostel_id}
//             onClick={() => setSelectedHostel(hostel)}
//           >
//             {hostel.hostelName} - {hostel.address}
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </Container>
//   );
// };

// export default MyHostelSearch;
import React, { useState, useEffect, useCallback, useRef } from "react";
import "../css/HostelSearch.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries = ["places"];

const MyHostelSearch = ({ isSidebarOpen }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Use environment variable for security
    libraries,
  });
  const mapRef = useRef(null);
  const navigate = useNavigate();
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
          if (isNavigating) {
            fetchNearbyHostels(location);
            if (selectedHostel) {
              getDirections(selectedHostel);
            }
          }
        },
        () => alert("Unable to retrieve your location."),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(id);
    }
  }, [isNavigating, selectedHostel]);

  const fetchNearbyHostels = useCallback(
    _.throttle(async (location) => {
      if (!location) return;
      try {
        console.log("Latitude:", location.lat);
        console.log("Longitude:", location.lng);
        const response = await axios.get(
          "http://localhost:8080/api/hostels/nearby",
          {
            params: { latitude: location.lat, longitude: location.lng },
          }
        );
        setHostels(response.data);
      } catch (error) {
        console.error("Error fetching nearby hostels:", error);
      }
    }, 10000),
    []
  );

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/hostels/search",
        {
          params: {
            location: searchLocation,
            userLat: userLocation?.lat,
            userLng: userLocation?.lng,
          },
        }
      );
      setHostels(response.data);
      if (response.data.length > 0) {
        // Get the first hostel location (assuming sorted results)
        const firstHostel = response.data[0];
        const hostelLocation = {
          lat: firstHostel.latitude,
          lng: firstHostel.longitude,
        };

        // Set new map center
        setMapCenter(hostelLocation);

        // Adjust the map bounds to fit both user and searched hostel
        if (mapRef.current && userLocation) {
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(
            new window.google.maps.LatLng(userLocation.lat, userLocation.lng)
          );
          bounds.extend(
            new window.google.maps.LatLng(
              hostelLocation.lat,
              hostelLocation.lng
            )
          );
          mapRef.current.fitBounds(bounds);
        }
      }
    } catch (error) {
      console.error("Error searching hostels:", error);
    }
  };
  const adjustMapBounds = (hostelLocation) => {
    if (mapRef.current && userLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(userLocation);
      bounds.extend(hostelLocation);
      mapRef.current.fitBounds(bounds); // Adjusts zoom to fit both points
    }
  };

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
          adjustMapBounds({ lat: hostel.latitude, lng: hostel.longitude });
        } else {
          console.error("Directions request failed due to:", status);
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
    <div
      className="hostel-search-container"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "60px", // Prevent overlap
        padding: "20px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => fetchNearbyHostels(userLocation)}>
          Nearby Hostels
        </button>
      </div>
      <div className="navigation-buttons">
        <button onClick={handleStartNavigation}>Start</button>
        <button onClick={handleStopNavigation}>Stop</button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={mapCenter}
        onLoad={(map) => (mapRef.current = map)}
      >
        {userLocation && <Marker position={userLocation} label="You" />}
        {hostels.map((hostel) => (
          <Marker
            key={hostel.hostel_id}
            position={{ lat: hostel.latitude, lng: hostel.longitude }}
            onClick={() => {
              setSelectedHostel(hostel);
              getDirections(hostel);
            }}
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
              <h3>{selectedHostel.hostelName}</h3>
              <p>{selectedHostel.address}</p>
              <button onClick={() => getDirections(selectedHostel)}>
                Get Directions
              </button>
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
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#00008B",
                strokeOpacity: 1,
                strokeWeight: 4,
              },
            }}
          />
        )}
      </GoogleMap>
      <div className="hostel-list">
        {hostels.map((hostel) => (
          <div className="hostel-card" key={hostel.hostel_id}>
            <h3>{hostel.hostelName}</h3>
            <p>{hostel.address}</p>
            {/* <p>
              <strong>Distance:</strong>{" "}
              {hostel.distance >= 1000
                ? (hostel.distance / 1000).toFixed(2) + " km"
                : hostel.distance.toFixed(2) + " meters"}
            </p> */}
            <br />
            <button
              className="book-now"
              onClick={() => navigate(`/booking/${parseInt(hostel.hostel_id)}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHostelSearch;

//
//
//
//  import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";
// import _ from "lodash";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc",
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
//   const [directions, setDirections] = useState(null);
//   const [travelInfo, setTravelInfo] = useState(null);
//   const [isNavigating, setIsNavigating] = useState(false);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       const id = navigator.geolocation.watchPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location);
//           if (isNavigating) {
//             throttledFetchNearbyHostels(location);
//             if (selectedHostel) {
//               getDirections(selectedHostel);
//             }
//           }
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//       return () => navigator.geolocation.clearWatch(id); // Clear watch on component unmount
//     }
//   }, [isNavigating, selectedHostel]);

//   const throttledFetchNearbyHostels = _.throttle(async (location) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             latitude: location.lat,
//             longitude: location.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   }, 10000); // Throttle to every 10 seconds

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error searching hostels:", error);
//     }
//   };

//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//           setTravelInfo(result.routes[0].legs[0]);
//         }
//       }
//     );
//   };

//   const handleStartNavigation = () => {
//     setIsNavigating(true);
//     if (selectedHostel) {
//       getDirections(selectedHostel);
//     }
//   };

//   const handleStopNavigation = () => {
//     setIsNavigating(false);
//     setDirections(null);
//     setTravelInfo(null);
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Enter location"
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//         />
//         <button onClick={handleSearch}>Search</button>
//         <button onClick={() => throttledFetchNearbyHostels(userLocation)}>
//           Nearby Hostels
//         </button>
//       </div>
//       <div className="navigation-buttons">
//         <button onClick={handleStartNavigation}>Start</button>
//         <button onClick={handleStopNavigation}>Stop</button>
//       </div>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//       >
//         {userLocation && <Marker position={userLocation} label="You" />}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button>
//               {travelInfo && (
//                 <div>
//                   <p>
//                     <strong>Distance:</strong> {travelInfo.distance.text}
//                   </p>
//                   <p>
//                     <strong>Time:</strong> {travelInfo.duration.text}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//         {directions && (
//           <DirectionsRenderer
//             directions={directions}
//             options={{
//               polylineOptions: {
//                 strokeColor: "#00008B",
//                 strokeOpacity: 1,
//                 strokeWeight: 4,
//               },
//             }}
//           />
//         )}
//       </GoogleMap>
//       <div className="hostel-list">
//         <h3>Hostel List</h3>
//         <ul>
//           {hostels.map((hostel) => (
//             <li key={hostel.hostel_id} onClick={() => getDirections(hostel)}>
//               <h4>{hostel.hostelName}</h4>
//               <p>{hostel.address}</p>
//               {travelInfo &&
//                 travelInfo.end_location.lat === hostel.latitude &&
//                 travelInfo.end_location.lng === hostel.longitude && (
//                   <div>
//                     <p>
//                       <strong>Distance:</strong> {travelInfo.distance.text}
//                     </p>
//                     <p>
//                       <strong>Time:</strong> {travelInfo.duration.text}
//                     </p>
//                   </div>
//                 )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MyHostelSearch;

// import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc",
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
//   const [directions, setDirections] = useState(null);
//   const [watchId, setWatchId] = useState(null);
//   const [travelInfo, setTravelInfo] = useState(null);
//   const [isNavigating, setIsNavigating] = useState(false);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location);
//           fetchNearbyHostels(location);
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   const fetchNearbyHostels = async (location) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             latitude: location.lat,
//             longitude: location.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error searching hostels:", error);
//     }
//   };

//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//           setTravelInfo(result.routes[0].legs[0]);
//         }
//       }
//     );
//   };

//   const startNavigation = () => {
//     if (!selectedHostel) {
//       alert("Select a hostel first.");
//       return;
//     }
//     setIsNavigating(true);

//     const id = navigator.geolocation.watchPosition(
//       (position) => {
//         const newLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setUserLocation(newLocation);
//         setMapCenter(newLocation);

//         // Update Directions in Real-Time
//         const directionsService = new window.google.maps.DirectionsService();
//         directionsService.route(
//           {
//             origin: newLocation,
//             destination: {
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             },
//             travelMode: window.google.maps.TravelMode.DRIVING,
//           },
//           (result, status) => {
//             if (status === "OK") {
//               setDirections(result);
//               setTravelInfo(result.routes[0].legs[0]);
//             }
//           }
//         );
//       },
//       (error) => console.error("Error updating location:", error),
//       { enableHighAccuracy: true, maximumAge: 0 }
//     );

//     setWatchId(id);
//   };

//   const stopNavigation = () => {
//     if (watchId) {
//       navigator.geolocation.clearWatch(watchId);
//       setWatchId(null);
//       setIsNavigating(false);
//     }
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Enter location"
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//         />
//         <button onClick={handleSearch}>Search</button>
//         <button onClick={() => fetchNearbyHostels(userLocation)}>
//           Nearby Hostels
//         </button>
//       </div>

//       <div className="navigation-controls">
//         <button onClick={startNavigation} disabled={isNavigating}>
//           Start
//         </button>
//         <button onClick={stopNavigation} disabled={!isNavigating}>
//           Stop
//         </button>
//       </div>

//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//       >
//         {userLocation && <Marker position={userLocation} label="You" />}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button>
//               {travelInfo && (
//                 <div>
//                   <p>
//                     <strong>Distance:</strong> {travelInfo.distance.text}
//                   </p>
//                   <p>
//                     <strong>Time:</strong> {travelInfo.duration.text}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MyHostelSearch;

// import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc",
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
//   const [directions, setDirections] = useState(null);
//   const [watchId, setWatchId] = useState(null);
//   const [travelInfo, setTravelInfo] = useState(null);

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location);
//           fetchNearbyHostels(location);
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   const fetchNearbyHostels = async (location) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             lat: location.lat,
//             lng: location.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error searching hostels:", error);
//     }
//   };

//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//           setTravelInfo(result.routes[0].legs[0]);
//         }
//       }
//     );
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Enter location"
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//         />
//         <button onClick={handleSearch}>Search</button>
//         <button onClick={() => fetchNearbyHostels(userLocation)}>
//           Nearby Hostels
//         </button>
//       </div>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//       >
//         {userLocation && <Marker position={userLocation} label="You" />}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button>
//               {travelInfo && (
//                 <div>
//                   <p>
//                     <strong>Distance:</strong> {travelInfo.distance.text}
//                   </p>
//                   <p>
//                     <strong>Time:</strong> {travelInfo.duration.text}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MyHostelSearch;
// import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "you-api",
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
//   const [directions, setDirections] = useState(null);
//   const [watchId, setWatchId] = useState(null);
//   const [travelInfo, setTravelInfo] = useState(null);

//   // Fetch user's current location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location);
//           getNearbyHostels(location);
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   // Fetch nearby hostels based on user's location
//   const getNearbyHostels = async (location) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             latitude: location.lat,
//             longitude: location.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   };

//   // Fetch hostels based on search location
//   const searchHostels = async () => {
//     if (!searchLocation) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//       if (response.data.length > 0) {
//         setMapCenter({
//           lat: response.data[0].latitude,
//           lng: response.data[0].longitude,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching hostels:", error);
//     }
//   };

//   // Get directions to a selected hostel
//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//           setTravelInfo(result.routes[0].legs[0]);
//         }
//       }
//     );
//   };

//   // Start live navigation to the selected hostel
//   const startNavigation = () => {
//     if (!selectedHostel) {
//       alert("Please select a hostel first.");
//       return;
//     }
//     if (navigator.geolocation) {
//       const id = navigator.geolocation.watchPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(newLocation);

//           const directionsService = new window.google.maps.DirectionsService();
//           directionsService.route(
//             {
//               origin: newLocation,
//               destination: {
//                 lat: selectedHostel.latitude,
//                 lng: selectedHostel.longitude,
//               },
//               travelMode: window.google.maps.TravelMode.DRIVING,
//             },
//             (result, status) => {
//               if (status === "OK") {
//                 setDirections(result);
//                 setTravelInfo(result.routes[0].legs[0]);
//               }
//             }
//           );
//         },
//         (error) => {
//           console.error("Error watching position:", error);
//         },
//         { enableHighAccuracy: true }
//       );
//       setWatchId(id);
//     }
//   };

//   // Stop live navigation
//   const stopNavigation = () => {
//     if (watchId) {
//       navigator.geolocation.clearWatch(watchId);
//       setWatchId(null);
//       setTravelInfo(null);
//     }
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//           placeholder="Enter location"
//         />
//         <button onClick={searchHostels}>Search</button>
//       </div>

//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//       >
//         {userLocation && <Marker position={userLocation} label="You" />}

//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}

//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button>
//               <button onClick={startNavigation}>Start Navigation</button>
//               <button onClick={stopNavigation}>Stop Navigation</button>
//               {travelInfo && (
//                 <div>
//                   <p>
//                     <strong>Distance:</strong> {travelInfo.distance.text}
//                   </p>
//                   <p>
//                     <strong>Time:</strong> {travelInfo.duration.text}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </InfoWindow>
//         )}

//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MyHostelSearch;

// import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc", // 🔑 Add your API key here
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
//   const [directions, setDirections] = useState(null);
//   const [watchId, setWatchId] = useState(null);

//   // 📌 Get User Location on Load
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location);
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   // 📌 Get Hostels by Search Location
//   const searchHostels = async () => {
//     if (!searchLocation) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//       if (response.data.length > 0) {
//         setMapCenter({
//           lat: response.data[0].latitude,
//           lng: response.data[0].longitude,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching hostels:", error);
//     }
//   };

//   // 📌 Get Nearby Hostels Based on User Location
//   const getNearbyHostels = async () => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             latitude: userLocation.lat,
//             longitude: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   };

//   // 📌 Get Directions to Selected Hostel
//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//         } else {
//           console.error("Directions request failed due to", status);
//         }
//       }
//     );
//   };

//   // 📌 Start Real-Time Navigation
//   const startNavigation = () => {
//     if (!selectedHostel) {
//       alert("Please select a hostel first.");
//       return;
//     }
//     if (navigator.geolocation) {
//       const id = navigator.geolocation.watchPosition(
//         (position) => {
//           const newLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(newLocation);

//           const directionsService = new window.google.maps.DirectionsService();
//           directionsService.route(
//             {
//               origin: newLocation,
//               destination: {
//                 lat: selectedHostel.latitude,
//                 lng: selectedHostel.longitude,
//               },
//               travelMode: window.google.maps.TravelMode.DRIVING,
//             },
//             (result, status) => {
//               if (status === "OK") {
//                 setDirections(result);
//               }
//             }
//           );
//         },
//         (error) => {
//           console.error("Error watching position:", error);
//         },
//         { enableHighAccuracy: true }
//       );
//       setWatchId(id);
//     }
//   };

//   // 📌 Stop Navigation
//   const stopNavigation = () => {
//     if (watchId) {
//       navigator.geolocation.clearWatch(watchId);
//       setWatchId(null);
//     }
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Enter location..."
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//         />
//         <button onClick={searchHostels}>Search</button>
//         <button onClick={getNearbyHostels}>Find Nearby Hostels</button>
//       </div>

//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//       >
//         {userLocation && <Marker position={userLocation} label="You" />}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button>
//               <button onClick={startNavigation}>Start Navigation</button>
//               <button onClick={stopNavigation}>Stop Navigation</button>
//             </div>
//           </InfoWindow>
//         )}
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MyHostelSearch;

// import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsService,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc", // 🔑 Add your API key here
//     libraries,
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [searchedCoords, setSearchedCoords] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
//   const [directions, setDirections] = useState(null);

//   // 📌 Get User Location on Load
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location); // Set map center to user location
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   // 📌 Get Hostels by Search Location
//   const searchHostels = async () => {
//     if (!searchLocation) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//       if (response.data.length > 0) {
//         const newCoords = {
//           lat: response.data[0].latitude,
//           lng: response.data[0].longitude,
//         };
//         setSearchedCoords(newCoords);
//         setMapCenter(newCoords); // Move map to searched location
//       }
//     } catch (error) {
//       console.error("Error fetching hostels:", error);
//     }
//   };

//   // 📌 Get Nearby Hostels Based on User Location
//   const getNearbyHostels = async () => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             latitude: userLocation.lat,
//             longitude: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   };

//   // 📌 Get Directions to Selected Hostel
//   const getDirections = (hostel) => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: { lat: hostel.latitude, lng: hostel.longitude },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK") {
//           setDirections(result);
//         } else {
//           console.error("Directions request failed due to", status);
//         }
//       }
//     );
//   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       {/* 🔍 Search Input */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Enter location..."
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//         />
//         <button onClick={searchHostels}>Search</button>
//         <button onClick={getNearbyHostels}>Find Nearby Hostels</button>
//       </div>

//       {/* 🗺️ Google Map */}
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//         options={{ disableDefaultUI: false, zoomControl: true }}
//       >
//         {/* 🔴 User's Current Location Marker */}
//         {userLocation && (
//           <Marker
//             position={userLocation}
//             label="You"
//             icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
//           />
//         )}

//         {/* 🔵 Searched Location Marker */}
//         {/* {searchedCoords && (
//           <Marker
//             position={searchedCoords}
//             label="Search"
//             icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//           />
//         )} */}

//         {/* 🏨 Hostel Markers */}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               getDirections(hostel);
//             }}
//           />
//         ))}

//         {/* ℹ️ Info Window for Selected Hostel */}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button>
//             </div>
//           </InfoWindow>
//         )}

//         {/* 🛣️ Directions Renderer */}
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>

//       {/* 📋 Hostel List */}
//       <div className="hostel-list">
//         {hostels.map((hostel) => (
//           <div className="hostel-card" key={hostel.hostel_id}>
//             <h3>{hostel.hostelName}</h3>
//             <p>{hostel.address}</p>
//             <p>
//               <strong>Latitude:</strong> {hostel.latitude}
//             </p>
//             <p>
//               <strong>Longitude:</strong> {hostel.longitude}
//             </p>
//             <p>
//               <strong>Distance:</strong> {hostel.distance.toFixed(2)} meters
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyHostelSearch;

// import React, { useState, useEffect } from "react";
// import "../css/HostelSearch.css";
// import {
//   GoogleMap,
//   Marker,
//   InfoWindow,
//   useLoadScript,
//   DirectionsService,
//   DirectionsRenderer,
// } from "@react-google-maps/api";
// import axios from "axios";

// const mapContainerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const libraries = ["places"];

// const MyHostelSearch = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBQ_Wg-SYxzy06OeQ0wGC7hHvujv0SPmoc", // 🔑 Add your API key here
//     libraries: ["places"],
//   });

//   const [searchLocation, setSearchLocation] = useState("");
//   const [hostels, setHostels] = useState([]);
//   const [selectedHostel, setSelectedHostel] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [searchedCoords, setSearchedCoords] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
//   const [directions, setDirections] = useState(null);
//   const [navigating, setNavigating] = useState(false);

//   // 📌 Get User Location on Load
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           setUserLocation(location);
//           setMapCenter(location); // Set map center to user location
//         },
//         () => {
//           alert("Unable to retrieve your location.");
//         },
//         { enableHighAccuracy: true }
//       );
//     }
//   }, []);

//   // 📌 Get Hostels by Search Location
//   const searchHostels = async () => {
//     if (!searchLocation) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/search`,
//         {
//           params: {
//             location: searchLocation,
//             userLat: userLocation.lat,
//             userLng: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//       if (response.data.length > 0) {
//         const newCoords = {
//           lat: response.data[0].latitude,
//           lng: response.data[0].longitude,
//         };
//         setSearchedCoords(newCoords);
//         setMapCenter(newCoords); // Move map to searched location
//       }
//     } catch (error) {
//       console.error("Error fetching hostels:", error);
//     }
//   };

//   // 📌 Get Nearby Hostels Based on User Location
//   const getNearbyHostels = async () => {
//     if (!userLocation) {
//       alert("User location not available.");
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/hostels/nearby`,
//         {
//           params: {
//             latitude: userLocation.lat,
//             longitude: userLocation.lng,
//           },
//         }
//       );
//       setHostels(response.data);
//     } catch (error) {
//       console.error("Error fetching nearby hostels:", error);
//     }
//   };

//   const handleGetDirections = async () => {
//     if (!isLoaded) {
//       alert("Google Maps is still loading. Please wait.");
//       return;
//     }
//     if (!userLocation || !selectedHostel) {
//       alert("User location or destination is missing.");
//       return;
//     }

//     setNavigating(true); // Start navigating (disable button, show loading)

//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: userLocation,
//         destination: {
//           lat: selectedHostel.latitude,
//           lng: selectedHostel.longitude,
//         },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirections(result);
//         } else {
//           alert("Unable to fetch directions.");
//         }
//         setNavigating(false); // Stop navigating after getting directions
//       }
//     );
//   };

//   //   const handleGetDirections = async () => {
//   //     if (!userLocation || !selectedHostel) {
//   //       alert("User location or destination is missing.");
//   //       return;
//   //     }

//   //     setNavigating(true); // Start navigating (disable button, show loading)

//   //     const directionsService = new window.google.maps.DirectionsService();
//   //     directionsService.route(
//   //       {
//   //         origin: userLocation,
//   //         destination: {
//   //           lat: selectedHostel.latitude,
//   //           lng: selectedHostel.longitude,
//   //         },
//   //         travelMode: window.google.maps.TravelMode.DRIVING,
//   //       },
//   //       (result, status) => {
//   //         if (status === window.google.maps.DirectionsStatus.OK) {
//   //           setDirections(result);
//   //         } else {
//   //           alert("Unable to fetch directions.");
//   //         }
//   //         setNavigating(false); // Stop navigating after getting directions
//   //       }
//   //     );
//   //   };
//   //   const handleGetDirections = async () => {
//   //     if (!userLocation || !selectedHostel) {
//   //       alert("User location or destination is missing.");
//   //       return;
//   //     }

//   //     setNavigating(true); // Start navigating (disable button, show loading)

//   //     const directionsService = new google.maps.DirectionsService();
//   //     directionsService.route(
//   //       {
//   //         origin: userLocation,
//   //         destination: {
//   //           lat: selectedHostel.latitude,
//   //           lng: selectedHostel.longitude,
//   //         },
//   //         travelMode: google.maps.TravelMode.DRIVING,
//   //       },
//   //       (result, status) => {
//   //         if (status === google.maps.DirectionsStatus.OK) {
//   //           setDirections(result);
//   //         } else {
//   //           alert("Unable to fetch directions.");
//   //         }
//   //         setNavigating(false); // Stop navigating after getting directions
//   //       }
//   //     );
//   //   };

//   // 📌 Get Directions to Selected Hostel
//   //   const getDirections = (hostel) => {
//   //     if (!userLocation) {
//   //       alert("User location not available.");
//   //       return;
//   //     }
//   //     const directionsService = new window.google.maps.DirectionsService();
//   //     directionsService.route(
//   //       {
//   //         origin: userLocation,
//   //         destination: { lat: hostel.latitude, lng: hostel.longitude },
//   //         travelMode: window.google.maps.TravelMode.DRIVING,
//   //       },
//   //       (result, status) => {
//   //         if (status === "OK") {
//   //           setDirections(result);
//   //         } else {
//   //           console.error("Directions request failed due to", status);
//   //         }
//   //       }
//   //     );
//   //   };

//   if (loadError) return <p>Error loading maps</p>;
//   if (!isLoaded) return <p>Loading maps...</p>;

//   return (
//     <div className="hostel-search-container">
//       {/* 🔍 Search Input */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Enter location..."
//           value={searchLocation}
//           onChange={(e) => setSearchLocation(e.target.value)}
//         />
//         <button onClick={searchHostels}>Search</button>
//         <button onClick={getNearbyHostels}>Find Nearby Hostels</button>
//       </div>

//       {/* 🗺️ Google Map */}
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={mapCenter}
//         options={{ disableDefaultUI: false, zoomControl: true }}
//       >
//         {/* 🔴 User's Current Location Marker */}
//         {userLocation && (
//           <Marker
//             position={userLocation}
//             label="You"
//             icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
//           />
//         )}

//         {/* 🔵 Searched Location Marker */}
//         {searchedCoords && (
//           <Marker
//             position={searchedCoords}
//             label="Search"
//             icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//           />
//         )}

//         {/* 🏨 Hostel Markers */}
//         {hostels.map((hostel) => (
//           <Marker
//             key={hostel.hostel_id}
//             position={{ lat: hostel.latitude, lng: hostel.longitude }}
//             onClick={() => {
//               setSelectedHostel(hostel);
//               handleGetDirections(hostel);
//             }}
//           />
//         ))}

//         {/* ℹ️ Info Window for Selected Hostel */}
//         {selectedHostel && (
//           <InfoWindow
//             position={{
//               lat: selectedHostel.latitude,
//               lng: selectedHostel.longitude,
//             }}
//             onCloseClick={() => setSelectedHostel(null)}
//           >
//             <div>
//               <h3>{selectedHostel.hostelName}</h3>
//               <p>{selectedHostel.address}</p>
//               {/* <button onClick={() => getDirections(selectedHostel)}>
//                 Get Directions
//               </button> */}
//               <button onClick={handleGetDirections} disabled={navigating}>
//                 {navigating ? "Fetching route..." : "Navigate"}
//               </button>
//             </div>
//           </InfoWindow>
//         )}

//         {/* 🛣️ Directions Renderer */}
//         {directions && <DirectionsRenderer directions={directions} />}
//       </GoogleMap>

//       {/* 📋 Hostel List */}
//       <div className="hostel-list">
//         {hostels.map((hostel) => (
//           <div className="hostel-card" key={hostel.hostel_id}>
//             <h3>{hostel.hostelName}</h3>
//             <p>{hostel.address}</p>
//             <p>
//               <strong>Latitude:</strong> {hostel.latitude}
//             </p>
//             <p>
//               <strong>Longitude:</strong> {hostel.longitude}
//             </p>
//             <p>
//               <strong>Distance:</strong> {hostel.distance.toFixed(2)} meters
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyHostelSearch;
