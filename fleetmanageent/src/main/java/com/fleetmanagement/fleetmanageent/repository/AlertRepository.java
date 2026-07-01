package com.fleetmanagement.fleetmanageent.repository;

import com.fleetmanagement.fleetmanageent.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
}
