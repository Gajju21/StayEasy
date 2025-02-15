package com.stayeasy.entity;

import org.locationtech.jts.geom.Point;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_locations")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long location_id;

    @Column(name = "location", columnDefinition = "POINT", nullable = false)
    private Point location;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;
}



//package com.stayeasy.entity;
//import jakarta.persistence.*;
//
//import java.util.List;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name="user_location")
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//public class UserLocation {
//	   
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long location_id;
//
//    private double latitude;
//    private double longitude;
//  
//
//    @OneToOne
//    @JoinColumn(name = "user_id",referencedColumnName = "user_id", nullable = false)
//    private User user;
//}
