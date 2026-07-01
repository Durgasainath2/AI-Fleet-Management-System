package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fuel")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fuel {
    @Id
    private String id;
    private String vehicle;
    private Double quantity;
    
    @Column(name = "fuel_cost")
    private Double cost;
    
    @Column(name = "fuel_date")
    private String date;
}
