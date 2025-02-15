package com.stayeasy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stayeasy.dao.UserDao;
import com.stayeasy.entity.User;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class UserService {
	@Autowired
    private final UserDao userRepository;

    public UserService(UserDao userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }
}

//@Service
//public class UserService {
//
//    @Autowired
//    private UserDao userRepository;
//
//    @Autowired
//    private LocationDao locationRepository;
//
//    public User updateUserLocation(Long userId, double latitude, double longitude) {
//        Optional<User> optionalUser = userRepository.findById(userId);
//        if (optionalUser.isPresent()) {
//            User user = optionalUser.get();
//            Location location = user.getLocation();
//            if (location == null) {
//                location = new Location();
//                user.setLocation(location);
//            }
//            location.setLatitude(latitude);
//            location.setLongitude(longitude);
//            locationRepository.save(location);
//            return userRepository.save(user);
//        }
//        return null;
//    }
//}
