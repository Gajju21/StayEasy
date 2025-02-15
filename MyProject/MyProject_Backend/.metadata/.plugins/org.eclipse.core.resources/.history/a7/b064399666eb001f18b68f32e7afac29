package com.stayeasy.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stayeasy.entity.Booking;
import com.stayeasy.entity.User;

import jakarta.transaction.Transactional;

@Repository

public interface BookingDao extends JpaRepository<Booking,Long>{
	
	@Query(value="select * from booking  where user_id=:userId",nativeQuery=true)
	public List<Booking> getbooking(@Param("userId")Long userId);
	
	@Query(value="select * from booking where hostel_id=:hostelId",nativeQuery = true)
	public List<Booking> findByHostelId(@Param("hostelId") Long hostelId);
	
	
	@Transactional
	@Modifying
	@Query(value="update booking set status='CONFIRMED' where booking_id=:bookingId",nativeQuery = true)
	 int confirmbooking(@Param("bookingId") Long bookingId);
	
	
	@Transactional
	@Modifying
	@Query(value="update booking set status='CANCELLED' where booking_id=:bookingId",nativeQuery = true)
	int cancelbooking(@Param("bookingId") Long bookingId);


}
