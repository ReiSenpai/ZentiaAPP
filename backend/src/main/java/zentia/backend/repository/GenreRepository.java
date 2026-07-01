package zentia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import zentia.backend.entity.Genre;

public interface GenreRepository extends JpaRepository<Genre, Long>{
    
}
