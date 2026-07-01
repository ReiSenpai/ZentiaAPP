package zentia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import zentia.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    
}
