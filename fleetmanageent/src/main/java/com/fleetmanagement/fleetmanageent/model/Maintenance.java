package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "maintenance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {
    @Id
    private String id;
    private String vehicle;
    private String serviceType;
    
    @Column(name = "service_cost")
    private Double cost;
    
    private String prevDate;
    private String nextDate;
}
