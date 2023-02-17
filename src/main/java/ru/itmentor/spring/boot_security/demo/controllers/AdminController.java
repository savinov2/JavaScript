package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.Users;
import ru.itmentor.spring.boot_security.demo.repositories.RoleRepository;
import ru.itmentor.spring.boot_security.demo.services.UsersServices;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UsersServices usersServices;
    private final RoleRepository roleRepository;

    public AdminController(UsersServices usersServices, RoleRepository roleRepository) {
        this.usersServices = usersServices;
        this.roleRepository = roleRepository;
    }

    @GetMapping("")
    public String getAllUsers(Model model) {
        model.addAttribute("users", usersServices.findAllUsers());
        return "admin";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") int id){
        usersServices.deleteUser(id);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String editUser(@PathVariable("id") int id, Model model){
        Users user = usersServices.findUsersById(id).orElse(null);
        model.addAttribute("user",user);
        model.addAttribute("rols",roleRepository.findAll());
        return "edit";
    }

    @PatchMapping("/{id}/edit")
    public String updateUser(@ModelAttribute("user") Users usersUpdate, @PathVariable("id") int id,
                             @RequestParam(value = "editRols", defaultValue = "2") List<Role> inputRoles){
        Set<Role> roles = new HashSet<>(inputRoles);
        usersUpdate.setRoles(roles);
        usersServices.updateUserByIdAndUsers(usersUpdate,id);
        return"redirect:/admin";
    }

    @GetMapping("/new")
    public String newUser(Model model){
        model.addAttribute("newUser",new Users());
        return "new";
    }

    @PostMapping("/new")
    public String create(@ModelAttribute("newUser") Users user){
        usersServices.saveUser(user);
        return "redirect:/admin";
    }

}
