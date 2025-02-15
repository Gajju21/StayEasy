
package com.stayeasy.controller;

import com.stayeasy.dto.HostelDTO;
import com.stayeasy.dto.HostelResponseDTO;
import com.stayeasy.dto.RegisterHostelDTO;
import com.stayeasy.entity.Hostel;
import com.stayeasy.Services.HostelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostels")
public class HostelController {
	
@Autowired
    private  HostelService hostelService;

//    public HostelController(HostelService hostelService) {
//        this.hostelService = hostelService;
//    }

    @PostMapping("/register")
    public ResponseEntity<?> registerHostel(@RequestBody RegisterHostelDTO hostelDTO) {
        Hostel savedHostel = hostelService.registerHostel(hostelDTO);
        System.out.println("hostel added");
        HostelResponseDTO hostelresponseDTO = hostelService.mapToHostelResponseDTO(savedHostel);
        return ResponseEntity.ok(hostelresponseDTO);
    }
@GetMapping("/hostelIds/{ownerId}")
public List<Long> gethostelidsofuser(@PathVariable long ownerId){
	return hostelService.gethostelids(ownerId);
	
}
    @GetMapping
    public ResponseEntity<List<Hostel>> getAllHostels() {
        return ResponseEntity.ok(hostelService.getAllHostels());
    }
}
