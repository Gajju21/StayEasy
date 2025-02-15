package com.stayeasy.dto;
import java.util.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class HostelResponseDTO {


	    private Long ownerId;
	    private String hostelName;
	    private String address;
	    private RegisterHostelLocationDTO location;
	    private List<RoomDTO> rooms;
}
