package com.stayeasy.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayeasy.entity.User;
@Repository
public interface UserDao extends JpaRepository<User, Long>{
	   Optional<User> findByEmail(String email);
}


