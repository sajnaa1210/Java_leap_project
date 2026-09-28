package com.project.loyalty.model;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="point_transactions")
public class PointTransaction {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(optional=false) @JoinColumn(name="customer_id") private Customer customer;
 @Enumerated(EnumType.STRING) private TransactionType type; private int points; private double purchaseAmount; private String note; private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public void setId(Long id){this.id=id;} public Customer getCustomer(){return customer;} public void setCustomer(Customer c){customer=c;} public TransactionType getType(){return type;} public void setType(TransactionType t){type=t;} public int getPoints(){return points;} public void setPoints(int p){points=p;} public double getPurchaseAmount(){return purchaseAmount;} public void setPurchaseAmount(double a){purchaseAmount=a;} public String getNote(){return note;} public void setNote(String n){note=n;} public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime t){createdAt=t;}
}
