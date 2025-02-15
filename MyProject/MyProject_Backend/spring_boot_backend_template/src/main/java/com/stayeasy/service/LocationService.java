////package com.stayeasy.service;
////
////import com.stayeasy.dao.LocationDao;
////import com.stayeasy.dao.UserDao;
////import com.stayeasy.entity.Location;
////import com.stayeasy.entity.User;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.stereotype.Service;
////
////import java.util.Optional;
////
////@Service
////public class LocationService {
////
////    @Autowired
////    private UserDao userRepository;
////
////    @Autowired
////    private LocationDao locationRepository;
////    
////
////    // Update user's live location
////    public User updateUserLocation(Long userId, double latitude, double longitude) {
////        Optional<User> optionalUser = userRepository.findById(userId);
////        if (optionalUser.isPresent()) {
////            User user = optionalUser.get();
////            Location location = user.getLocation();
////
////            if (location == null) {
////                location = new Location();
////                user.setLocation(location);
////            }
////
////            location.setLatitude(latitude);
////            location.setLongitude(longitude);
////            locationRepository.save(location);
////            return userRepository.save(user);
////        }
////        return null;
////    }
////
////    // Calculate distance between user and hostel using Haversine formula
////    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
////        final int R = 6371; // Radius of the Earth in km
////        double dLat = Math.toRadians(lat2 - lat1);
////        double dLon = Math.toRadians(lon2 - lon1);
////
////        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
////                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
////                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
////
////        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
////        return R * c * 1000; // Convert to meters
////    }
////}
//////import org.springframework.stereotype.Service;
////import org.springframework.beans.factory.annotation.Autowired;
////import java.util.Optional;
////
////@Service
////public class LocationService {
////    @Autowired
////    private UserRepository userRepository;
////    @Autowired
////    private LocationRepository locationRepository;
////
////    public void updateUserLocation(Long userId, double latitude, double longitude) {
////        String newGeohash = GeohashUtil.generateGeohash(latitude, longitude);
////
////        // Check if location already exists
////        Optional<Location> existingLocation = locationRepository.findByGeohash(newGeohash);
////
////        Location location = existingLocation.orElseGet(() -> {
////            Location newLocation = new Location(latitude, longitude);
////            return locationRepository.save(newLocation);
////        });
////
////        // Update User's Location
////        User user = userRepository.findById(userId).orElseThrow();
////        user.setLocation(location);
////        userRepository.save(user);
////    }
////}
//
//
//
//
////it id latest code with frontend tracking
//
//package com.stayeasy.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import com.stayeasy.entity.UserLocation;
//import com.stayeasy.dao.LocationDao;
//
//@Service
//public class LocationService {
//
//    @Autowired
//    private LocationDao locationdao;
//
//    // Method to update the user's location
//    public UserLocation updateUserLocation(Long userId, double latitude, double longitude) {
//        UserLocation location = new UserLocation();
//        location.setLatitude(latitude);
//        location.setLongitude(longitude);
//
//        // Store the location in the database (optionally, you can associate it with the User)
//        // location.setUser(user);  // Optionally associate with a user, if needed
//        return locationdao.save(location);
//    }
//}
//
//
