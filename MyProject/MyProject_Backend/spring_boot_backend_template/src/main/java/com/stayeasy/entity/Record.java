package com.stayeasy.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Record")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Record {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long record_id;
	
	 @ManyToOne(fetch = FetchType.LAZY, optional = false)
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;
	 
	 @ManyToOne(fetch = FetchType.LAZY, optional = false)
	    @JoinColumn(name = "hostel_id", nullable = false)
	    private Hostel hostel;
	
	@ManyToOne
	@JoinColumn(name="room_id",nullable = false)
	private Room room;
	
	private LocalDateTime actiondate;
	

}
