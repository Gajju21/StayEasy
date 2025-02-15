package com.stayeasy.Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    @Autowired
    private JavaMailSender mailSender;

    // Temporary storage for OTPs (Use Redis for better performance)
    private ConcurrentHashMap<String, String> otpStorage = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999)); // 6-digit OTP
        System.out.println("in service otp is "+otp);
        otpStorage.put(email, otp);
        sendOtpEmail(email, otp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }

    public void sendOtpEmail(String email, String otp) {
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mailSender.createMimeMessage(), true);
            helper.setTo(email);
            helper.setSubject("Your OTP Code");
            helper.setText("Your OTP code is: " + otp);
            mailSender.send(helper.getMimeMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
