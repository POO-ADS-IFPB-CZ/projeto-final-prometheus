package com.prometheus.projeto_final_prometheus.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String username;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "dt_cadastro", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dtCadastro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType tipo;

    @Column(name = "profile_image")
    private String profileImage;

    @JsonManagedReference
    @OneToMany(mappedBy = "creator")
    private Set<Event> createdEvents = new HashSet<>();

    @JsonBackReference
    @ManyToMany(mappedBy = "participants")
    private Set<Event> eventsAttended = new HashSet<>();

    @JsonBackReference
    @OneToMany(mappedBy = "user")
    private Set<Certificates> certificates = new HashSet<>();

    public User(String username, String email, String password, UserType userType, String file) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.tipo = userType;
        this.profileImage = file;
    }

    @PrePersist
    public void prePersist() {
        this.dtCadastro = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.tipo == UserType.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        } else {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
