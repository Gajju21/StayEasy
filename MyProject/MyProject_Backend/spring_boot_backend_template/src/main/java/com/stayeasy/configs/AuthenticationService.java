package com.stayeasy.configs;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stayeasy.custom_exception.ResourceNotFoundException;
import com.stayeasy.dao.UserDao;
import com.stayeasy.dto.UserLoginDto;
import com.stayeasy.dto.UserRegisterDto;
import com.stayeasy.dto.UserResponseDto;
import com.stayeasy.entity.User;
import com.stayeasy.entity.UserType;



@Service
@Transactional
public class AuthenticationService {
	@Autowired
    private final UserDao userRepository;
	@Autowired
	private ModelMapper mapper;
    
    private final PasswordEncoder passwordEncoder;
    
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        UserDao userRepository,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

  
    public User signup(UserRegisterDto input) {
    	 Optional<User> existingUser = userRepository.findByEmail(input.getEmail());
    	if(existingUser.isPresent()) {throw new RuntimeException("Email  is already registered ");}
    	else {
        User user = new User();
        user.setFirstName(input.getFirstName());
        user.setLastName(input.getLastName());
        user.setEmail(input.getEmail());
        user.setPhoneno(input.getPhoneNo());
        user.setUsertype(UserType.valueOf(input.getRole()));
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        

        return userRepository.save(user);}
    }
    public UserResponseDto getuserdto(Long id) throws ResourceNotFoundException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " ));
        System.out.println(existingUser.getPhoneno()+" this is phone no.");

        System.out.println(existingUser.getUsertype()+" this is user role");
        UserResponseDto userdto=mapper.map(existingUser, UserResponseDto.class);
        userdto.setRole(existingUser.getUsertype().toString());
        userdto.setPhoneno(existingUser.getPhoneno());
		return userdto;
    }
    public User updateuser(Long userId, UserResponseDto input) throws ResourceNotFoundException {
        // Step 1: Retrieve the user from the database using the userId
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " ));

        // Step 2: Update only the fields that are provided in the request
        if (input.getFirstName() != null) {
            existingUser.setFirstName(input.getFirstName());
        }
        if (input.getLastName() != null) {
            existingUser.setLastName(input.getLastName());
        }
        if (input.getEmail() != null) {
            existingUser.setEmail(input.getEmail());
        }
        if(input.getPhoneno() != null) {
            existingUser.setPhoneno(input.getPhoneno());
        }
       
        if(existingUser.getUsertype()==Enum.valueOf(UserType.class,"ROLE_USER")){
        	existingUser.setUsertype(Enum.valueOf(UserType.class,"ROLE_USER"));
        }else {
        	existingUser.setUsertype(Enum.valueOf(UserType.class,"ROLE_OWNER"));
        }
        
       

        // Step 3: Save the updated user to the repository
        return userRepository.save(existingUser);
    }

    public String deleteuser(Long id) {
    	if(userRepository.existsById(id)) {
    		userRepository.deleteById(id);
    		return "User deleted successfully";
    	}
    	
    	return "Id not found";
    }

    public User Authenticate(UserLoginDto input) {
    	Authentication authentication =   authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return (User) authentication.getPrincipal();
    }
}