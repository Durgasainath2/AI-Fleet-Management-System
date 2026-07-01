package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "VEHICLE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "VEHICLE_NUMBER")
    private String number;
    
    @Column(name = "VEHICLE_TYPE")
    private String type;
    
    @Column(name = "PURCHASE_DATE")
    private String purchaseDate;

    @Column(name = "INSURANCE_EXPIRY")
    private String insuranceExpiry;
    
    @Column(name = "VEHICLE_STATUS")
    private String status;
}
