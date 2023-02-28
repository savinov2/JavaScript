package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.itmentor.spring.boot_security.demo.security.UsersDetails;


@Controller
public class UsersControler{
    @GetMapping("/admin")
    public String authAdminRole() {
        return "admin";
    }

    @GetMapping("/user")
    public String authUserRole() {
        return "user";
    }
}
