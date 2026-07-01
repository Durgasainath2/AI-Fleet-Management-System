package com.fleetmanagement.fleetmanageent.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    private String id;
    private String vehicle;
    private String title;
    
    @Column(name = "alert_type")
    private String type;
    
    @Column(name = "alert_date")
    private String date;
}
