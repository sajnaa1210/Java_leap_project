package com.project.loyalty.repository;
import com.project.loyalty.model.PointTransaction; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface PointTransactionRepository extends JpaRepository<PointTransaction,Long>{ List<PointTransaction> findByCustomerIdOrderByCreatedAtDesc(Long customerId); }
