package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "breakdowns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Breakdown {
    @Id
    private String id;
    private String vehicle;
    private String location;
    private Double distance;
    private Boolean rangeWarning;
    private String issueType;
    
    @Column(length = 4000)
    private String description;
    
    @Column(length = 4000)
    private String photo;
    
    @Column(name = "breakdown_date")
    private String date;
    
    @Column(name = "breakdown_status")
    private String status;
    
    private String mechanicStatus;
    private String driverName;
    private String driverId;
}
