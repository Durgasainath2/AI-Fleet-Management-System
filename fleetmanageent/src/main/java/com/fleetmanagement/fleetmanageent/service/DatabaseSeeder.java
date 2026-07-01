package com.fleetmanagement.fleetmanageent.service;

import com.fleetmanagement.fleetmanageent.model.*;
import com.fleetmanagement.fleetmanageent.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private VehicleRepository vehicleRepository;
    @Autowired private DriverRepository driverRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private FuelRepository fuelRepository;
    @Autowired private MaintenanceRepository maintenanceRepository;
    @Autowired private RepairRepository repairRepository;
    @Autowired private BreakdownRepository breakdownRepository;
    @Autowired private AlertRepository alertRepository;

    @Override
    public void run(String... args) throws Exception {
        if (employeeRepository.count() == 0) {
            seedEmployees();
        }
        if (vehicleRepository.count() == 0) {
            seedVehicles();
        }
        if (driverRepository.count() == 0) {
            seedDrivers();
        }
        if (tripRepository.count() == 0) {
            seedTrips();
        }
        if (fuelRepository.count() == 0) {
            seedFuel();
        }
        if (maintenanceRepository.count() == 0) {
            seedMaintenance();
        }
        if (repairRepository.count() == 0) {
            seedRepairs();
        }
        if (breakdownRepository.count() == 0) {
            seedBreakdowns();
        }
        if (alertRepository.count() == 0) {
            seedAlerts();
        }
    }

    private void seedEmployees() {
        employeeRepository.saveAll(Arrays.asList(
            new Employee("EMP001", "Sainath", "sainath@gmail.com", "9876543210", "ADMIN", "2024-01-15", "admin123"),
            new Employee("EMP002", "Ananya Sharma", "ananya@fleet.com", "9876543215", "MANAGER", "2024-05-10", "manager123"),
            new Employee("EMP003", "Kiran Kumar", "kiran@fleet.com", "9876543216", "DISPATCHER", "2025-02-01", "dispatcher123"),
            new Employee("EMP004", "Rajesh Mechanic", "rajesh@fleet.com", "9876543220", "MECHANIC", "2026-01-10", "mechanic123")
        ));
    }

    private void seedVehicles() {
        vehicleRepository.saveAll(Arrays.asList(
            new Vehicle("101", "AP39AB1234", "Truck", "2023-01-10", "2026-06-29", "Active"),
            new Vehicle("102", "TS09BC8899", "Truck", "2022-05-15", "2026-08-14", "Under Maintenance"),
            new Vehicle("103", "KA51MB4567", "Van", "2024-02-20", "2026-12-10", "Active"),
            new Vehicle("104", "MH12XY1122", "Truck", "2021-11-05", "2026-06-25", "Active"),
            new Vehicle("105", "DL01AB9999", "Car", "2023-09-18", "2027-01-20", "Active")
        ));
    }

    private void seedDrivers() {
        driverRepository.saveAll(Arrays.asList(
            new Driver("DRV001", "Ramesh", "9123456789", "DL-AP391234", "2026-07-07", "AP39AB1234", "driver123"),
            new Driver("DRV002", "Suresh", "9123456780", "DL-TS098899", "2026-07-15", "TS09BC8899", "driver123"),
            new Driver("DRV003", "Mahesh", "9123456781", "DL-KA514567", "2027-05-10", "KA51MB4567", "driver123"),
            new Driver("DRV004", "Naresh", "9123456782", "DL-MH121122", "2026-06-30", "MH12XY1122", "driver123")
        ));
    }

    private void seedTrips() {
        tripRepository.saveAll(Arrays.asList(
            new Trip("TRP001", "Hyderabad", "Vijayawada", 275.0, "Ramesh", "AP39AB1234", "2026-06-20"),
            new Trip("TRP002", "Bangalore", "Chennai", 350.0, "Mahesh", "KA51MB4567", "2026-06-18"),
            new Trip("TRP003", "Pune", "Mumbai", 150.0, "Naresh", "MH12XY1122", "2026-06-21"),
            new Trip("TRP004", "Delhi", "Jaipur", 280.0, "Ramesh", "AP39AB1234", "2026-06-15"),
            new Trip("TRP005", "Bangalore", "Hyderabad", 570.0, "Mahesh", "KA51MB4567", "2026-06-10")
        ));
    }

    private void seedFuel() {
        fuelRepository.saveAll(Arrays.asList(
            new Fuel("FL001", "AP39AB1234", 80.0, 8800.0, "2026-06-18"),
            new Fuel("FL002", "KA51MB4567", 45.0, 4950.0, "2026-06-17"),
            new Fuel("FL003", "MH12XY1122", 75.0, 8250.0, "2026-06-20"),
            new Fuel("FL004", "TS09BC8899", 90.0, 9900.0, "2026-05-12"),
            new Fuel("FL005", "AP39AB1234", 85.0, 9350.0, "2026-06-12")
        ));
    }

    private void seedMaintenance() {
        maintenanceRepository.saveAll(Arrays.asList(
            new Maintenance("MNT001", "AP39AB1234", "Engine Tuning", 15000.0, "2026-04-10", "2026-06-23"),
            new Maintenance("MNT002", "KA51MB4567", "Brake Replacement", 8500.0, "2026-05-01", "2026-08-01"),
            new Maintenance("MNT003", "TS09BC8899", "Suspension Repair", 22000.0, "2026-06-10", "2026-09-10"),
            new Maintenance("MNT004", "MH12XY1122", "Oil Change", 4500.0, "2026-06-15", "2026-12-15")
        ));
    }

    private void seedRepairs() {
        repairRepository.saveAll(Arrays.asList(
            new Repair("REP001", "TS09BC8899", "Engine Overheating Repair", 12000.0, "Completed", "2026-06-22"),
            new Repair("REP002", "AP39AB1234", "Rear Axle Alignment & Suspension check", 8500.0, "Assigned", "2026-06-22"),
            new Repair("REP003", "KA51MB4567", "Brake Pad Replacement", 4500.0, "Pending", "2026-06-21")
        ));
    }

    private void seedBreakdowns() {
        breakdownRepository.saveAll(Arrays.asList(
            new Breakdown("BD001", "TS09BC8899", "NH-44 Highway, Mile 142", 45.0, false, "Engine Failure", "Engine heating up and white smoke coming out of hood.", null, "2026-06-21", "Pending", "Pending", "Suresh", "DRV002"),
            new Breakdown("BD002", "AP39AB1234", "Vijayawada Highway Toll", 72.0, true, "Tyre Puncture", "Left rear tyre burst due to metal piece.", null, "2026-06-19", "Resolved", "Completed", "Ramesh", "DRV001")
        ));
    }

    private void seedAlerts() {
        alertRepository.saveAll(Arrays.asList(
            new Alert("ALT001", "AP39AB1234", "Insurance Expiring in 7 Days", "warning", "2026-06-22"),
            new Alert("ALT002", "AP39AB1234", "Driver License Expiring in 15 Days", "warning", "2026-06-22"),
            new Alert("ALT003", "AP39AB1234", "Service Due Tomorrow", "danger", "2026-06-22"),
            new Alert("ALT004", "MH12XY1122", "High Fuel Consumption Alert", "info", "2026-06-21"),
            new Alert("ALT005", "TS09BC8899", "High Maintenance Cost Alert", "danger", "2026-06-20")
        ));
    }
}
