package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    private String id;
    private String name;
    private String phone;
    private String licenseNumber;
    private String licenseExpiry;
    private String assignedVehicle;
    private String password;
}
