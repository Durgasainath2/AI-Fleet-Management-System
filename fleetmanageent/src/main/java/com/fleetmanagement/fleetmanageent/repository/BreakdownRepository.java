package com.fleetmanagement.fleetmanageent.repository;

import com.fleetmanagement.fleetmanageent.model.Breakdown;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BreakdownRepository extends JpaRepository<Breakdown, String> {
}
