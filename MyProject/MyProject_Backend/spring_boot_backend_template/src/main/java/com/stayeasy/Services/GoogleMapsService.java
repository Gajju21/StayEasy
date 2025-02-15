package com.stayeasy.Services;

import com.google.maps.DistanceMatrixApi;
import com.google.maps.GeoApiContext;
import com.google.maps.GeocodingApi;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.DistanceMatrixElement;
import com.google.maps.model.DistanceMatrixRow;
import com.google.maps.model.GeocodingResult;
import com.google.maps.model.TravelMode;
import com.stayeasy.dao.HostelDao;
import com.stayeasy.dto.HostelDTO;
import com.stayeasy.dto.LocationCoordinates;
import com.stayeasy.entity.Hostel;

import jakarta.transaction.Transactional;
import org.geolatte.geom.Point;
import org.geolatte.geom.codec.Wkt;
import org.geolatte.geom.crs.CoordinateReferenceSystems;
//import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GoogleMapsService {
    @Autowired
    private final GeoApiContext context;
    @Autowired
    private  HostelDao hostelRepository;

    @Value("${google.maps.api.key}")
    private String googleApiKey;

    @Autowired
    public GoogleMapsService(HostelDao hostelRepository) {
        this.hostelRepository = hostelRepository;
        this.context = new GeoApiContext.Builder()
                .apiKey(googleApiKey)  // Use the API key injected from application.properties
                .build();
    }
    public List<HostelDTO> getNearbyHostels(double userLat, double userLng, double searchedLat, double searchedLng) {
        // ✅ Convert latitude & longitude to POINT format
        String currentPoint = "POINT(" + userLng + " " + userLat + ")";
        String searchedPoint = "POINT(" + searchedLng + " " + searchedLat + ")";

        // ✅ Fetch hostels from the repository
        List<Object[]> getSearchHostels = hostelRepository.findHostelsByLocation(currentPoint, searchedPoint);

        // ✅ Convert query results to DTO list
        return getSearchHostels.stream().map(obj -> {
            Long hostelId = ((Number) obj[0]).longValue();  // ✅ Hostel ID
            String hostelName = (String) obj[1];  // ✅ Name
            String address = (String) obj[2];  // ✅ Address
            Point<?> location = (Point<?>) obj[3];  // ✅ Location as WKT String
            double distance = ((Number) obj[4]).doubleValue();  // ✅ Distance

            // ✅ Extract lat/lon from the WKT format (POINT(lon lat))
            double lat = location.getPosition().getCoordinate(1);  // Y -> Latitude
            double lon = location.getPosition().getCoordinate(0);  // X -> Longitude

            return new HostelDTO(hostelId, hostelName, address, lat, lon, distance);
        }).collect(Collectors.toList());
    }
//    public List<HostelDTO> getNearbyHostels(double latitude, double longitude) {
//        String point = "POINT(" + longitude + " " + latitude + ")";
//        List<Object[]> getsearchhostels = hostelRepository.findHostelsByLocation(point);
//     //   h.hostel_id, h.hostelname, h.address, hl.location
//        return getsearchhostels.stream().map(obj -> {
//            Long hostelId = ((Number) obj[0]).longValue();  // ✅ Hostel ID
//            String hostelName = (String) obj[1];  // ✅ Name
//            String address = (String) obj[2];  // ✅ Address
//            Point<?> location = (Point<?>) obj[3];    // ✅ Location as WKT String
//            double distance = ((Number) obj[4]).doubleValue();  // ✅ Distance
//
//            // ✅ Extract lat/lon from WKT format (POINT(lon lat))
//            // String[] coordinates = locationWKT.replace("POINT(", "").replace(")", "").split(" ");
//            double lat = location.getPosition().getCoordinate(1);  // Y -> Latitude
//            double lon = location.getPosition().getCoordinate(0);  // X -> Longitude  // ✅ Latitude (Y)
//
//            return new HostelDTO(hostelId, hostelName, address, lat, lon, distance);
//        }).collect(Collectors.toList());
//    }

//    public List<HostelDTO> getNearbyHostels(double latitude, double longitude) {
//        String point = "POINT(" + longitude + " " + latitude + ")";
//        List<Object[]> getsearchostels = hostelRepository.findHostelsByLocation(point);
//
//        return getsearchostels.stream().map(obj -> {
//            Long hostelId = ((Number) obj[0]).longValue();
//            String hostelName = (String) obj[1];
//            String address = (String) obj[2];
//            
//            // ✅ Handling Point correctly (assuming JTS Geometry)
//            Point<?> location = (Point<?>) obj[3];
//            
//            double lat = location.getPosition().getCoordinate(1);  // Y -> Latitude
//            double lon = location.getPosition().getCoordinate(0);  // JTS Point: getX() -> Longitude
//            
//            double distance = ((Number) obj[4]).doubleValue(); // ✅ Extracting distance
//
//            return new HostelDTO(hostelId, hostelName, address, lat, lon, distance);
//        }).collect(Collectors.toList());
//    }
    
//    public List<HostelDTO> getNearbyHostels(double latitude, double longitude) {
//        String point = "POINT(" + longitude + " " + latitude + ")";
//        List<Object[]> getsearchostels=hostelRepository.findHostelsByLocation(point);
//        
//        return getsearchostels.stream().map(obj -> {
//            Long hostelId = ((Number) obj[0]).longValue();  // ✅ Correct handling
//            String hostelName = (String) obj[1];
//            String address = (String) obj[2];
//            Point<?> location = (Point<?>) obj[3];  // ✅ Use Geolatte Point
//            double distance = ((Number) obj[4]).doubleValue(); 
//
//            // ✅ Extract coordinates correctly
//            double lat = location.getPosition().getCoordinate(1);  // Y -> Latitude
//            double lon = location.getPosition().getCoordinate(0);  // X -> Longitude
//
//            return new HostelDTO(hostelId, hostelName, address, lat, lon, distance);
//        }).collect(Collectors.toList());
//
//    }
    
    
    public List<HostelDTO> getHostelsNearUser(double latitude, double longitude) {
        String userLocation = "POINT(" + longitude + " " + latitude + ")";

        List<Object[]> results = hostelRepository.findNearbyHostels(userLocation);

        return results.stream().map(obj -> {
            Long hostelId = ((Number) obj[0]).longValue();  // ✅ Correct handling
            String hostelName = (String) obj[1];
            String address = (String) obj[2];
            Point<?> location = (Point<?>) obj[3];  // ✅ Use Geolatte Point
            double distance = ((Number) obj[4]).doubleValue(); 

            // ✅ Extract coordinates correctly
            double lat = location.getPosition().getCoordinate(1);  // Y -> Latitude
            double lon = location.getPosition().getCoordinate(0);  // X -> Longitude

            return new HostelDTO(hostelId, hostelName, address, lat, lon, distance);
        }).collect(Collectors.toList());
    }
//    public List<HostelDTO> getHostelsNearUser(double latitude, double longitude) {
//        // Convert user's coordinates to WKT format
//        String userLocation = "POINT(" + longitude + " " + latitude + ")";
//
//        // Fetch hostels sorted by nearest first
//        List<Object[]> results = hostelRepository.findNearbyHostels(userLocation);
//
//        // Convert results to DTO
//        List<HostelDTO> hostels = new ArrayList<>();
//        for (Object[] row : results) {
//            Hostel hostel = (Hostel) row[0]; // Fetch hostel entity
//            double distance = (double) row[1]; // Fetch calculated distance
//            
//            hostels.add(new HostelDTO(
//                hostel.getHostel_id(),
//                hostel.getHostelname(),
//                hostel.getAddress(),
//                hostel.getLocation().getLocation().getCoordinate().y, // Latitude
//                hostel.getLocation().getLocation().getCoordinate().x, // Longitude
//                distance // Add distance to response
//            ));
//        }
//        return hostels;
//    }
    
    public LocationCoordinates getCoordinatesFromLocation(String location) {
        try {
            GeocodingResult[] results = GeocodingApi.geocode(context, location).await();
            
            if (results != null && results.length > 0) {
                // Get the first result's location coordinates
                double latitude = results[0].geometry.location.lat;
                double longitude = results[0].geometry.location.lng;
                return new LocationCoordinates(latitude, longitude);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // Return null if location not found or error occurs
    }
    
    
    // Get nearby hostels based on user's current location and radius
//    public List<Hostel> getNearbyHostels(double userLat, double userLng) {
//        System.out.println("Searching hostels near: " + userLat + ", " + userLng);
//
//        List<Hostel> hostels = hostelRepository.findHostelsByLocation(userLat, userLng);
//        
//        if (hostels.isEmpty()) {
//            System.out.println("No hostels found within 5km radius.");
//        } else {
//            System.out.println("Found " + hostels.size() + " hostels.");
//        }
//        
//        return hostels;
//    }

    // Calculate the distance between two points using Google Maps API
//    public double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
//        try {
//            DistanceMatrix result = DistanceMatrixApi.newRequest(context)
//                    .origins(lat1 + "," + lng1)
//                    .destinations(lat2 + "," + lng2)
//                    .mode(TravelMode.DRIVING)
//                    .await();
//
//            if (result.rows.length > 0) {
//                DistanceMatrixRow row = result.rows[0];
//                if (row.elements.length > 0) {
//                    DistanceMatrixElement element = row.elements[0];
//                    if (element.distance != null) {
//                        return element.distance.inMeters / 1000.0; // Convert meters to kilometers
//                    }
//                }
//            }
//            return Double.MAX_VALUE; // Return large value if distance is not found
//        } catch (Exception e) {
//            e.printStackTrace();
//            return Double.MAX_VALUE; // Return large value in case of error
//        }
//    }
//
//    // Assuming you would need to implement this to search hostels by location
//    public List<Hostel> getHostelsByLocation(double latitude, double longitude) {
//    	String point = "POINT(" + longitude + " " + latitude + ")";
//        return hostelRepository.findHostelsByLocation(point);
//}
 

//    public double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
//        String url = String.format("https://maps.googleapis.com/maps/api/distancematrix/json?origins=%f,%f&destinations=%f,%f&key=%s",
//                lat1, lng1, lat2, lng2, googleApiKey);
//
//        DistanceMatrixResponse response = restTemplate.getForObject(url, DistanceMatrixResponse.class);
//        if (response != null && !response.getRows().isEmpty() && !response.getRows().get(0).getElements().isEmpty()) {
//            return response.getRows().get(0).getElements().get(0).getDistance().getValue() / 1000.0;
//        }
//        return Double.MAX_VALUE;
//    }
}


