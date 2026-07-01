package com.fleetmanagement.fleetmanageent.controller;

import com.fleetmanagement.fleetmanageent.dto.FleetDatabaseDTO;
import com.fleetmanagement.fleetmanageent.model.*;
import com.fleetmanagement.fleetmanageent.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SyncController {

    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private FuelRepository fuelRepository;
    @Autowired private MaintenanceRepository maintenanceRepository;
    @Autowired private RepairRepository repairRepository;
    @Autowired private BreakdownRepository breakdownRepository;
    @Autowired private AlertRepository alertRepository;

    @GetMapping("/sync")
    public FleetDatabaseDTO getDatabase() {
        FleetDatabaseDTO dto = new FleetDatabaseDTO();
        dto.setEmployees(employeeRepository.findAll());
        dto.setVehicles(vehicleRepository.findAll());
        dto.setDrivers(driverRepository.findAll());
        dto.setTrips(tripRepository.findAll());
        dto.setFuel(fuelRepository.findAll());
        dto.setMaintenance(maintenanceRepository.findAll());
        dto.setRepairs(repairRepository.findAll());
        dto.setBreakdowns(breakdownRepository.findAll());
        dto.setAlerts(alertRepository.findAll());

        // Construct passwords map from employees and drivers
        Map<String, String> passwords = new HashMap<>();
        for (Employee emp : dto.getEmployees()) {
            if (emp.getPassword() != null) {
                passwords.put(emp.getId(), emp.getPassword());
            }
        }
        for (Driver drv : dto.getDrivers()) {
            if (drv.getPassword() != null) {
                passwords.put(drv.getId(), drv.getPassword());
            }
        }
        dto.setPasswords(passwords);

        return dto;
    }

    @PostMapping("/sync")
    public FleetDatabaseDTO saveDatabase(@RequestBody FleetDatabaseDTO dto) {
        // Map passwords back to Employee and Driver entities if provided
        Map<String, String> passwords = dto.getPasswords();
        if (passwords != null) {
            if (dto.getEmployees() != null) {
                for (Employee emp : dto.getEmployees()) {
                    if (passwords.containsKey(emp.getId())) {
                        emp.setPassword(passwords.get(emp.getId()));
                    }
                }
            }
            if (dto.getDrivers() != null) {
                for (Driver drv : dto.getDrivers()) {
                    if (passwords.containsKey(drv.getId())) {
                        drv.setPassword(passwords.get(drv.getId()));
                    }
                }
            }
        }

        // Deletions first
        if (dto.getDeletedEmployeeIds() != null && !dto.getDeletedEmployeeIds().isEmpty()) {
            employeeRepository.deleteAllById(dto.getDeletedEmployeeIds());
        }
        if (dto.getDeletedVehicleIds() != null && !dto.getDeletedVehicleIds().isEmpty()) {
            vehicleRepository.deleteAllById(dto.getDeletedVehicleIds());
        }
        if (dto.getDeletedDriverIds() != null && !dto.getDeletedDriverIds().isEmpty()) {
            driverRepository.deleteAllById(dto.getDeletedDriverIds());
        }
        if (dto.getDeletedTripIds() != null && !dto.getDeletedTripIds().isEmpty()) {
            tripRepository.deleteAllById(dto.getDeletedTripIds());
        }
        if (dto.getDeletedFuelIds() != null && !dto.getDeletedFuelIds().isEmpty()) {
            fuelRepository.deleteAllById(dto.getDeletedFuelIds());
        }
        if (dto.getDeletedMaintenanceIds() != null && !dto.getDeletedMaintenanceIds().isEmpty()) {
            maintenanceRepository.deleteAllById(dto.getDeletedMaintenanceIds());
        }
        if (dto.getDeletedRepairIds() != null && !dto.getDeletedRepairIds().isEmpty()) {
            repairRepository.deleteAllById(dto.getDeletedRepairIds());
        }
        if (dto.getDeletedBreakdownIds() != null && !dto.getDeletedBreakdownIds().isEmpty()) {
            breakdownRepository.deleteAllById(dto.getDeletedBreakdownIds());
        }
        if (dto.getDeletedAlertIds() != null && !dto.getDeletedAlertIds().isEmpty()) {
            alertRepository.deleteAllById(dto.getDeletedAlertIds());
        }

        // Upsert updated/new entities
        if (dto.getEmployees() != null) {
            employeeRepository.saveAll(dto.getEmployees());
        }
        if (dto.getVehicles() != null) {
            vehicleRepository.saveAll(dto.getVehicles());
        }
        if (dto.getDrivers() != null) {
            driverRepository.saveAll(dto.getDrivers());
        }
        if (dto.getTrips() != null) {
            tripRepository.saveAll(dto.getTrips());
        }
        if (dto.getFuel() != null) {
            fuelRepository.saveAll(dto.getFuel());
        }
        if (dto.getMaintenance() != null) {
            maintenanceRepository.saveAll(dto.getMaintenance());
        }
        if (dto.getRepairs() != null) {
            repairRepository.saveAll(dto.getRepairs());
        }
        if (dto.getBreakdowns() != null) {
            breakdownRepository.saveAll(dto.getBreakdowns());
        }
        if (dto.getAlerts() != null) {
            alertRepository.saveAll(dto.getAlerts());
        }

        return getDatabase();
    }
}
