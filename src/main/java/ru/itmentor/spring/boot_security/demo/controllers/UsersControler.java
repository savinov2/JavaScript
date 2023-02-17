package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.itmentor.spring.boot_security.demo.security.UsersDetails;


@Controller
@RequestMapping("/user")
public class UsersControler {


    @GetMapping("")
    public String showUser(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UsersDetails usersDetails = (UsersDetails)authentication.getPrincipal();
        model.addAttribute("user", usersDetails.getUsers());
        System.out.println(usersDetails.getUsers().getUsername() +  " " + usersDetails.getUsers().getYearOfBirth());
        return "user";
    }

}
