package com.example.To_Do.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.To_Do.app.vao.ToDoItem;

import java.util.List;

public interface ToDoRepository extends JpaRepository<ToDoItem, Long>{
    List<ToDoItem> findByNaslovContainingIgnoreCase(String naslov);
    List<ToDoItem> findByUserIdAndNaslovContainingIgnoreCase(Long userId, String naslov);
    List<ToDoItem> findByUserId(Long userId);
}
