package com.stayeasy.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Collate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Review")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long review_id;
	
@ManyToOne
@JoinColumn(name="user_id",nullable=false)
private User user;

@Column(name="comment_msg",nullable=false)
private String msg;

@ManyToOne
@JoinColumn(name="hostel_id",nullable=false)
private Hostel hostel;

private LocalDateTime reviewDate;

@Column(nullable=false)
private int rating;

@Column(nullable=false)
private String comment;

}
