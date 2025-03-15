package com.example.server.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.Model.Admin;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
    // Optional<Admin> findById(String id);
    Optional<Admin> findByUsername(String username);
    Optional<Admin> findByEmail(String email);
    List<Admin> findByLocation(String location);
}


