package ru.itmentor.spring.boot_security.demo.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.Users;
import ru.itmentor.spring.boot_security.demo.repositories.UsersRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsersServices {
    private final UsersRepository usersRepository;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UsersServices(UsersRepository usersRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.usersRepository = usersRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<Users> findAllUsers() {
        return usersRepository.findAll();
    }
    @Transactional
    public boolean saveUser(Users users) {
        Optional<Users> userFromDB = usersRepository.findByEmail(users.getFirstName());

        if (!userFromDB.isEmpty()) {
            return false;
        }

        users.setRoles(Collections.singleton(new Role(2, "ROLE_USER")));
        users.setPassword(bCryptPasswordEncoder.encode(users.getPassword()));
        usersRepository.save(users);
        return true;
    }
    @Transactional
    public void deleteUser(int userId) {
            usersRepository.deleteById(userId);
    }


    public Optional<Users> findUsersById(int userId) {
        return usersRepository.findById(userId);
    }

    @Transactional
    public void updateUserByIdAndUsers(Users user, int userId) {
        user.setId(userId);
        usersRepository.save(user);
    }

    public List<String> getRolesInStringById(int id){
        Optional<Users> user = usersRepository.findById(id);
        return user.isEmpty() ? null : user.get().getRoles().stream().map(role -> role.getName()).collect(Collectors.toList());

    }
}
