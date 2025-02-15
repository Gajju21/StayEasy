package com.stayeasy.controller;

import com.stayeasy.entity.Booking;
import com.stayeasy.Services.BookingService;
import com.stayeasy.dto.BookingDto;
import com.stayeasy.dto.BookingResponseDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/booking")
    public ResponseEntity<?> createBooking(@RequestBody BookingDto bookingdto) {
    	BookingResponseDto savedBooking = bookingService.bookRoom(bookingdto);
        
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/getuserbookings/{userId}")
    public ResponseEntity<?> getAllBookingsbyuser(@PathVariable  Long userId) {
    	List<BookingResponseDto> bookings=bookingService.getAllBookingsOfUser(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/hostel/{hostelId}")
    public List<BookingResponseDto> getAllBookingsForHostel(@PathVariable Long hostelId) {
        return bookingService.getBookingsForHostel(hostelId);
    }

    // Approve a booking
    @PutMapping("/approve/{bookingId}")
    public String approveBooking(@PathVariable Long bookingId) {
        return bookingService.confirmBookingStatus(bookingId);
    }

    // Reject a booking
    @PutMapping("/reject/{bookingId}")
    public String rejectBooking(@PathVariable Long bookingId) {
        return bookingService.cancelBookingStatus(bookingId);
    }

//    @GetMapping("/{bookingId}")
//    public ResponseEntity<Booking> getBookingById(@PathVariable Long bookingId) {
//        Optional<Booking> booking = bookingService.getBookingById(bookingId);
//        return booking.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }

//    @PutMapping("/{bookingId}")
//    public ResponseEntity<Booking> updateBooking(@PathVariable Long bookingId, @RequestBody Booking updatedBooking) {
//        Booking booking = bookingService.updateBooking(bookingId, updatedBooking);
//        return ResponseEntity.ok(booking);
//    }

//    @DeleteMapping("/{bookingId}")
//    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId) {
//        bookingService.deleteBooking(bookingId);
//        return ResponseEntity.noContent().build();
//    }
}
