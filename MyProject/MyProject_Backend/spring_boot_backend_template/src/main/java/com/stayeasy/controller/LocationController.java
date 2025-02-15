//package com.stayeasy.controller;
//
//import com.stayeasy.dto.LocationDto;
//import com.stayeasy.entity.UserLocation;
//import com.stayeasy.service.LocationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/location")
//public class LocationController {
//
//    @Autowired
//    private LocationService userLocationService;
//
//    // Endpoint to update the user's location
//    @PostMapping("/update")
//    public ResponseEntity<String> updateLocation(@RequestBody LocationDto locationDto) {
//        // Call the service to update the user's location
//        UserLocation location = userLocationService.updateUserLocation(locationDto.getUserId(), locationDto.getLatitude(), locationDto.getLongitude());
//        return ResponseEntity.ok("Location updated successfully");
//    }
//}
