package com.fleetmanagement.fleetmanageent.dto;

import com.fleetmanagement.fleetmanageent.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FleetDatabaseDTO {
    private List<Employee> employees;
    private List<Vehicle> vehicles;
    private List<Driver> drivers;
    private List<Trip> trips;
    private List<Fuel> fuel;
    private List<Maintenance> maintenance;
    private List<Repair> repairs;
    private List<Breakdown> breakdowns;
    private List<Alert> alerts;
    private Map<String, String> passwords;

    // Deletion tracking lists
    private List<String> deletedVehicleIds;
    private List<String> deletedDriverIds;
    private List<String> deletedTripIds;
    private List<String> deletedFuelIds;
    private List<String> deletedMaintenanceIds;
    private List<String> deletedEmployeeIds;
    private List<String> deletedRepairIds;
    private List<String> deletedBreakdownIds;
    private List<String> deletedAlertIds;
}
