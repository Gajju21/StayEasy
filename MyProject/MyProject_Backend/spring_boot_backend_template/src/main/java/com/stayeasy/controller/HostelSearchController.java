package com.stayeasy.controller;

import com.stayeasy.Services.GoogleMapsService;
import com.stayeasy.dto.HostelDTO;
import com.stayeasy.dto.LocationCoordinates;
import com.stayeasy.entity.Hostel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hostels")
public class HostelSearchController {
	
@Autowired
    private  GoogleMapsService googleMapsService;

    @Autowired
    public HostelSearchController(GoogleMapsService googleMapsService) {
        this.googleMapsService = googleMapsService;
    }

    // Search hostels near the user's current location
    @GetMapping("/nearby")
    public List<HostelDTO> getHostelsNearMe(@RequestParam double latitude, @RequestParam double longitude) {
        return googleMapsService.getHostelsNearUser(latitude, longitude);
    }
    
    
    
//    public List<Map<String, Object>> searchHostelsNearUser(
//            @RequestParam double latitude,
//            @RequestParam double longitude) {  // Default radius is 5 km
//        List<Hostel> hostels = googleMapsService.getNearbyHostels(latitude, longitude);
//        return hostels.stream()
//                .map(hostel -> Map.of(
//                        "hostel_id", hostel.getHostel_id(),
//                        "Hostelname", hostel.getHostelname(),
//                        "location", hostel.getLocation()
//                ))
//                .collect(Collectors.toList());
//    }

    @GetMapping("/search")
    public List<HostelDTO> searchHostelsByLocation(@RequestParam String location, 
                                                   @RequestParam double userLat, 
                                                   @RequestParam double userLng) {
        // ✅ Convert location name to coordinates using Google Maps API
        LocationCoordinates coords = googleMapsService.getCoordinatesFromLocation(location);
        
        // ✅ Pass both the searched location and the user's current location
        return googleMapsService.getNearbyHostels(userLat, userLng, coords.getLatitude(), coords.getLongitude());
    }
    // Search hostels by a specific location (name)
//    @GetMapping("/search")
//    public List<HostelDTO> searchHostelsByLocation(@RequestParam String location) {
//        // Convert location name to coordinates using Google Maps API
//        LocationCoordinates coords = googleMapsService.getCoordinatesFromLocation(location);
//        return googleMapsService.getNearbyHostels(coords.getLatitude(), coords.getLongitude());

//        if (coords != null) {
//            // Fetch hostels nearby
//            List<HostelDTO> hostels = googleMapsService.getNearbyHostels(coords.getLatitude(), coords.getLongitude());
//            System.out.println("Latitude: " + coords.getLatitude() + ", Longitude: " + coords.getLongitude());
//       
//
//            // Convert List<Hostel> to List<HostelDTO>
//           
//        } else {
//            System.out.println("Empty or invalid location");
//            return List.of(); // Return empty list if location not found
//        }
    //}

}
