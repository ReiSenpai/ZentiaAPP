package zentia.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import zentia.backend.entity.Content;

public interface ContentRepository extends JpaRepository<Content, Long>{    
}
