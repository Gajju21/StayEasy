package com.stayeasy.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.geolatte.geom.G2D;
import org.geolatte.geom.Point;
import org.geolatte.geom.builder.DSL;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static org.geolatte.geom.crs.CoordinateReferenceSystems.WGS84;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.stayeasy.dao.HostelDao;
import com.stayeasy.dao.HostelLocationDao;
import com.stayeasy.dao.RoomDao;
import com.stayeasy.dao.UserDao;
import com.stayeasy.dto.HostelResponseDTO;
import com.stayeasy.dto.RegisterHostelDTO;
import com.stayeasy.dto.RegisterHostelLocationDTO;
import com.stayeasy.dto.RoomDTO;
import com.stayeasy.entity.Hostel;
import com.stayeasy.entity.HostelLocation;
import com.stayeasy.entity.Room;
import com.stayeasy.entity.User;


@Service
@Transactional
public class HostelService {

	@Autowired
    private final HostelDao hostelRepository;
	@Autowired
    private final UserDao userRepository;
	@Autowired
    private final HostelLocationDao hostellocationdao;
	@Autowired
    private final RoomDao roomdao;

    public HostelService(HostelDao hostelRepository, UserDao userRepository,
                         HostelLocationDao hostellocationdao, RoomDao roomdao) {
        this.hostelRepository = hostelRepository;
        this.userRepository = userRepository;
        this.hostellocationdao = hostellocationdao;
        this.roomdao = roomdao;
    }

    @Transactional  // Ensures atomicity of DB operations ✅
    public Hostel registerHostel(RegisterHostelDTO hostelDTO) {
        User owner = userRepository.findById(hostelDTO.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // Validate Location DTO
        if (hostelDTO.getLocation() == null) {
            throw new RuntimeException("Hostel location cannot be null");
        }
        System.out.println(" hostellocation latitude "+hostelDTO.getLocation().getLatitude());
        System.out.println(" hostellocation longitude "+hostelDTO.getLocation().getLongitude());
        // Create and Save Location First
        System.out.println("before hostellocation");
        HostelLocation location = new HostelLocation();
        System.out.println("after hostellocation");
        Point<G2D> point = DSL.point(WGS84, DSL.g(
                hostelDTO.getLocation().getLongitude(),
                hostelDTO.getLocation().getLatitude()
        ));
        
        System.out.println("after point");
        System.out.println(" hostellocation latitude "+hostelDTO.getLocation().getLatitude());
        System.out.println(" hostellocation longitude "+hostelDTO.getLocation().getLongitude());
        location.setLocation(point);
        System.out.println("after setpoint");
        String point2="point("+hostelDTO.getLocation().getLongitude()+" "+hostelDTO.getLocation().getLatitude()+")";
        int affecetedRow = hostellocationdao.insertHostelLocation(point2);
        if(affecetedRow==0) {
        	throw new RuntimeException("not  inserted hostel location");
        }
        if(affecetedRow>0) {
        	System.out.println("hostellocation inserted");
        }
         location=hostellocationdao.findLastInsertedLocation().orElseThrow(()->{throw new RuntimeException("Not found");});
        System.out.println("after location save ");// Persist location ✅

        // Create Hostel Entity
        Hostel hostel = new Hostel();
        System.out.println("now hosstel initialse ");
        hostel.setHostelname(hostelDTO.getHostelName());
        hostel.setAddress(hostelDTO.getAddress());
        hostel.setOwner(owner);
        hostel.setLocation(location);  
        System.out.println(" hosstel before save ");// Assign saved location ✅

        hostel = hostelRepository.save(hostel); 
        System.out.println("now after  save ");// Save Hostel next ✅

        // Save Rooms after Hostel is saved
        List<Room> rooms = new ArrayList<>();
        for (RoomDTO roomDTO : hostelDTO.getRooms()) {
            Room room = new Room();
            room.setRoomnumber(roomDTO.getRoomNumber());
            room.setSharing(roomDTO.getSharing());
            room.setPrice(roomDTO.getPrice());
            room.setAvailable(roomDTO.isAvailable());
            room.setHostel(hostel);
//            hostel.getRooms().add(room);
            // Assign saved Hostel ✅
            rooms.add(room);
           
        }
        hostel.setRooms(rooms);
        
       
        hostel = hostelRepository.save(hostel); 
        System.out.println("before returning hostel  ");
        if (!rooms.isEmpty()) {
            roomdao.saveAll(rooms);  // Save Rooms ✅
        } 
        return hostel;
    }
    
    
    public HostelResponseDTO mapToHostelResponseDTO(Hostel hostel) {
        if (hostel == null || hostel.getLocation() == null || hostel.getLocation().getLocation() == null) {
            throw new IllegalArgumentException("Hostel or Location is null");
        }

        // Extract Latitude and Longitude
        Point<G2D> point = hostel.getLocation().getLocation();
        RegisterHostelLocationDTO locationDTO = new RegisterHostelLocationDTO(point.getPosition().getLat(), point.getPosition().getLon());

        // Convert Room Entities to DTOs
        List<RoomDTO> roomDTOs = (hostel.getRooms() != null) ? 
                hostel.getRooms().stream()
                    .map(room -> new RoomDTO(
                    		room.getRoom_id(),
                        room.getRoomnumber(),
                        room.getSharing(),
                   
                        room.getPrice(),
                        room.isAvailable()
                    ))
                    .collect(Collectors.toList())
                : Collections.emptyList();

        return new HostelResponseDTO(
            hostel.getOwner().getUser_id(), // Assuming owner is set
            hostel.getHostelname(),
            hostel.getAddress(),
            locationDTO,
            roomDTOs
        );
    }

    

    public List<Hostel> getAllHostels() {
        return hostelRepository.findAll();
    }
    public List<Long> gethostelids(Long ownerId){
    	return hostelRepository.getlist(ownerId);
    }
}
