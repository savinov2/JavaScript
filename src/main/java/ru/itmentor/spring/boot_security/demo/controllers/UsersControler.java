package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import ru.itmentor.spring.boot_security.demo.security.UsersDetails;


@Controller
public class UsersControler {

    @GetMapping("/users")
    public String getUsers() {
        return "hello";
    }

    @GetMapping("/hello")
    public String showUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UsersDetails usersDetails = (UsersDetails)authentication.getPrincipal();
        System.out.println(usersDetails.getUsers().getUsername() +  " " + usersDetails.getUsers().getYearOfBirth());
        return "hello";
    }
}
