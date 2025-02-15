package com.stayeasy.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostelDTO {
    private Long hostel_id;
    private String hostelName;
    private String address;
    private double longitude;
    private double latitude;
    private double distance;
    
	public HostelDTO(Long hostel_id, String hostelName, String address, double longitude, double latitude) {
		super();
		this.hostel_id = hostel_id;
		this.hostelName = hostelName;
		this.address = address;
		this.longitude = longitude;
		this.latitude = latitude;
	} 
}
