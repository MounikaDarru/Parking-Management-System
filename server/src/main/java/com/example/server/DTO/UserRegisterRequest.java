package com.example.server.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    private String username;
    private String email;
    private String password;
    private int phonenumber;
    private String vehiclenumber;
}
