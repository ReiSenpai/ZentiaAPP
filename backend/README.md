### ESTRUCTURA DEL BACEKND

com.zentia.backend
├── ZentiaApplication.java
├── config
│ ├── JwtFilter.java
│ └── SecurityConfig.java
├── controller
│ ├── AdminController.java
│ ├── AuthController.java
│ └── ContentController.java
├── dto
│ ├── AuthResponse.java
│ ├── GoogleLoginRequest.java
│ └── LoginRequest.java
├── entity
│ ├── Category.java <-- (Nueva)
│ ├── Content.java <-- (Actualizada)
│ ├── ContentType.java
│ ├── Episode.java
│ ├── Genre.java
│ ├── Role.java
│ ├── Season.java
│ └── User.java
├── repository
│ ├── CategoryRepository.java <-- (Nueva)
│ ├── ContentRepository.java
│ ├── GenreRepository.java
│ └── UserRepository.java
└── service
├── ContentService.java
├── CustomUserDetailsService.java
└── JwtService.java
