package com.example.To_Do.app.rest;

import com.example.To_Do.app.vao.ToDoItem;
import com.example.To_Do.app.dao.ToDoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class ToDoController {

    private final ToDoRepository repo;

    public ToDoController(ToDoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<ToDoItem> getAll() {
        return repo.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<ToDoItem> getByUserId(@PathVariable Long userId) {
        return repo.findByUserId(userId);
    }

    @PostMapping
    public ToDoItem create(@RequestBody ToDoItem item){
        return repo.save(item);
    }

    @PutMapping
    public ResponseEntity<ToDoItem> update(@RequestBody ToDoItem item){
        if (item.getId() == null || item.getUser() == null || item.getUser().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<ToDoItem> existingItem = repo.findById(item.getId());

        if (existingItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!existingItem.get().getUser().getId().equals(item.getUser().getId())) {
            return ResponseEntity.status(403).build();
        }

        item.setUser(existingItem.get().getUser());

        return ResponseEntity.ok(repo.save(item));
    }

    @DeleteMapping("/{id}/{userId}")
    public ResponseEntity<?> delete(@PathVariable Long id, @PathVariable Long userId){
        Optional<ToDoItem> existingItem = repo.findById(id);

        if (existingItem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (existingItem.get().getUser().getId().equals(userId)) {
            repo.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/search/user/{userId}")
    public ResponseEntity<?> iskanjeToDo(@RequestParam String naslov, @PathVariable Long userId){
        List<ToDoItem> results = repo.findByUserIdAndNaslovContainingIgnoreCase(userId, naslov);

        if(results.isEmpty()){
            return ResponseEntity.status(404).body(Map.of("message", "Ni najdenih opravil za iskalni niz: " + naslov));
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ToDoItem getById(@PathVariable Long id){
        return repo.findById(id).orElse(null);
    }

}
