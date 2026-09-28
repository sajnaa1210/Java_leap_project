package com.project.loyalty.model;
import jakarta.persistence.*; import jakarta.validation.constraints.*; import java.time.LocalDateTime;
@Entity @Table(name="customers")
public class Customer {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank private String name; @Email @NotBlank @Column(unique=true) private String email; private String phone;
 private int pointsBalance=0; private int lifetimePoints=0; @Enumerated(EnumType.STRING) private Tier tier=Tier.BRONZE; private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long id){this.id=id;} public String getName(){return name;} public void setName(String name){this.name=name;} public String getEmail(){return email;} public void setEmail(String email){this.email=email;} public String getPhone(){return phone;} public void setPhone(String phone){this.phone=phone;} public int getPointsBalance(){return pointsBalance;} public void setPointsBalance(int v){pointsBalance=v;} public int getLifetimePoints(){return lifetimePoints;} public void setLifetimePoints(int v){lifetimePoints=v;} public Tier getTier(){return tier;} public void setTier(Tier t){tier=t;} public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){createdAt=t;}
}
