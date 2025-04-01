package com.btec.gomoku_game.services;

import com.btec.gomoku_game.entities.Admin;
import com.btec.gomoku_game.entities.User;
import com.btec.gomoku_game.repositories.AdminRepository;
import com.btec.gomoku_game.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Tiêm bean từ Spring

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(String id, User updatedUser) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setBirthDay(updatedUser.getBirthDay());
            user.setActive(updatedUser.isActive());
            user.setAddress(updatedUser.getAddress());
            return userRepository.save(user);
        }
        return null;
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public Admin getAdminByUsername(String username) {
        return adminRepository.findByUsername(username).orElse(null);
    }

    @Override
    public void run(String... args) throws Exception {
        String[][] admins = {
                {"admin1", "admin123"},
                {"admin2", "admin456"},
                {"admin3", "admin789"}
        };

        for (String[] adminData : admins) {
            if (adminRepository.findByUsername(adminData[0]).isEmpty()) {
                Admin admin = new Admin(adminData[0], passwordEncoder.encode(adminData[1]));
                adminRepository.save(admin);
            }
        }
    }
}