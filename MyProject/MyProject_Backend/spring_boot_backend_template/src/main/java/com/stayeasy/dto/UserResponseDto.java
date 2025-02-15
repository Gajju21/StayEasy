package com.stayeasy.dto;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {

    private Long user_id; // Backend sets this before sending response
    private String firstName;
    private String lastName;
    private String email;
    private String phoneno;
    private String role;
    private String token;// "USER" or "OWNER"
}

