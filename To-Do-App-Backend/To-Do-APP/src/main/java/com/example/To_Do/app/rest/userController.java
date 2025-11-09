package com.example.To_Do.app.rest;

import com.example.To_Do.app.vao.User;
import com.example.To_Do.app.dao.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class userController {
    private final UserRepository repo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public userController(UserRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public Iterable<User> getAll(){
        return repo.findAll();
    }


    @PostMapping("/registracija")
    public ResponseEntity<?> postUser(@RequestBody User user){
        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        String passwordRegex = "^(?=.*[A-Z])(?=.*\\d).{6,}$";

        if (user.getFirstName() == null || user.getFirstName().isEmpty()
        || user.getLastName() == null || user.getLastName().isEmpty()
        || user.getEmail() == null || user.getEmail().isEmpty()
        || user.getPassword() == null || user.getPassword().isEmpty()){

            return ResponseEntity.badRequest().body(Map.of("message", "Ime, priimek, email in geslo so obvezni."));
        }

        if (!user.getEmail().matches(emailRegex)){
            return ResponseEntity.badRequest().body(Map.of("Message", "Email ni pravilen"));
        }

        if (!user.getPassword().matches(passwordRegex)){
            return ResponseEntity.badRequest().body(Map.of("message", "Geslo ni pravilno"));
        }

        if (repo.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email je že v uporabi."));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = repo.save(user);
        return ResponseEntity.ok(savedUser);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){
        if(user.getEmail() == null || user.getEmail().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()){

            return ResponseEntity.badRequest().body(Map.of("Message", "Email in geslo sta obvezna za prijavo"));
        }


        Optional<User> existingUser = repo.findByEmail(user.getEmail());
        if (existingUser.isEmpty()){
            return ResponseEntity.status(401).body(Map.of("Message", "Uporabnik s tem emailom ne obstaja."));
        }

        User dbUser = existingUser.get();
        if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())){
            return ResponseEntity.status(401).body(Map.of("Message", "Geslo ni pravilno."));
        }

        return ResponseEntity.ok(Map.of("Message", "Prijava uspešna", "user", dbUser));

    }


    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id){
        repo.deleteById(id);
    }

}
