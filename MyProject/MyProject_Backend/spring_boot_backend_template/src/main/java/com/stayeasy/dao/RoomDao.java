package com.stayeasy.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stayeasy.entity.Room;
@Repository
public interface RoomDao extends JpaRepository<Room, Long>{



	@Query(value="select * from room where hostel_id=:hostelId and available=1",nativeQuery = true)
	public List<Room> findRoomsByHostelId(@Param("hostelId") Long id);
	@Query(value="update room set available=0 where room_id:roomId",nativeQuery = true)
	public void setroomfull(@Param("roomId") Long roomId);
}
