package com.stayeasy.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stayeasy.Services.OtpService;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        String otp = otpService.generateOtp(email);
        System.out.println("otp is"+otp);
        return ResponseEntity.ok("OTP sent successfully to " + email);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if (otpService.verifyOtp(email, otp)) {
            return ResponseEntity.ok("OTP verified successfully!");
        }
        return ResponseEntity.badRequest().body("Invalid OTP!");
    }
}
