package com.stayeasy.dao;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayeasy.entity.UserLocation;



@Repository
public interface LocationDao extends JpaRepository<UserLocation, Long> {

}
