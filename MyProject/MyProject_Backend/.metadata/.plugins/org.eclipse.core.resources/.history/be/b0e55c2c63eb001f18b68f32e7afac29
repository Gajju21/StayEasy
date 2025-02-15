package com.stayeasy.Services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stayeasy.dao.RoomDao;
import com.stayeasy.dto.RoomDTO;
import com.stayeasy.entity.Room;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class RoomService {
	@Autowired
private RoomDao roomDao;
	@Autowired
	private ModelMapper mapper;
	public List<RoomDTO> getllAllRoomsbyHostelid(long hostelId){
		List<Room> allrooms=roomDao.findRoomsByHostelId(hostelId);

		    List<RoomDTO> roomDTOList = allrooms.stream()
		        .map(room -> new RoomDTO(
		            room.getRoom_id(),
		            room.getRoomnumber(),
		            room.getSharing(),
		            room.getPrice(),
		            room.isAvailable()
		        ))
		        .collect(Collectors.toList());

		    return roomDTOList;
	}
}
