package com.stayeasy.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDto {

  
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNo;
    private String address;
    private String password;
    private String confirmpassword;
    private String role; // This will store "USER" or "OWNER" based on UserType Enum
}
