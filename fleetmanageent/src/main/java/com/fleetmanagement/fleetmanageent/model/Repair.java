package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "repairs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repair {
    @Id
    private String id;
    private String vehicle;
    private String description;
    
    @Column(name = "repair_cost")
    private Double cost;
    
    @Column(name = "repair_status")
    private String status;
    
    @Column(name = "repair_date")
    private String date;
}
