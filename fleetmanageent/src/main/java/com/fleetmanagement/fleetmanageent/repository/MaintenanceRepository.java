package com.fleetmanagement.fleetmanageent.repository;

import com.fleetmanagement.fleetmanageent.model.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, String> {
}
