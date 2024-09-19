package com.example.mail.controller;

import com.example.common.ResponseDto;
import com.example.common.exception.StatusCode;
import com.example.mail.service.MailService;
import com.example.user.entity.User;
import com.example.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/email")
public class MailController {

    private final MailService mailService;
    private final UserService userService;

    public MailController(MailService mailService, UserService userService) {
        this.mailService = mailService;
        this.userService = userService;
    }

    @PostMapping("/regist")
    public ResponseEntity<ResponseDto> registerSend(@RequestParam("email") String email) {
        StatusCode statusCode;
        try {
            mailService.sendRMail(email);

            statusCode = StatusCode.MAIL_SENT;

        } catch (Exception e) {
            statusCode = StatusCode.BAD_REQUEST;
        }

        return ResponseDto.response(statusCode);
    }

    // send password E-MAIL
    @PostMapping("/password")
    public ResponseEntity<ResponseDto> passwordSend( @RequestParam("email") String email) {
        StatusCode statusCode;
        try {
            mailService.sendPMail(email);

            statusCode = StatusCode.MAIL_SENT;

        } catch (Exception e) {
            statusCode = StatusCode.BAD_REQUEST;
        }

        return ResponseDto.response(statusCode);
    }

    @GetMapping("/reset")
    public ResponseEntity<ResponseDto> resetPW(@RequestParam("email") String email){
        String tempPassword = userService.resetPassword(email);
        //System.out.println("TEMP PW : "+ tempPassword);
        if(tempPassword == null){
            return ResponseDto.response(StatusCode.NOT_FOUND);
        }

        mailService.resetPW(email,tempPassword);
        //비밀번호 실제로 변경
        mailService.setPWMail(email,tempPassword);
        //이메일로 쏴 줌
        return ResponseDto.response(StatusCode.RESET_SUCCESS,tempPassword);

    }

    // authenticate
    @GetMapping("/check")
    public ResponseEntity<ResponseDto> mailCheck(@RequestParam("email") String email, @RequestParam("userNumber") int userNumber) {
        StatusCode statusCode = mailService.checkCode(email,userNumber);
        return ResponseDto.response(statusCode);

    }






}
