package model;

import java.sql.Date;

public class driver {

    private int driverId;
    private String driverName;
    private String phoneNumber;
    private String licenseNumber;
    private Date licenseExpiryDate;
    private int assignedVehicleId;

    public driver(int driverId, String driverName,
                  String phoneNumber, String licenseNumber,
                  Date licenseExpiryDate, int assignedVehicleId) {

        this.driverId = driverId;
        this.driverName = driverName;
        this.phoneNumber = phoneNumber;
        this.licenseNumber = licenseNumber;
        this.licenseExpiryDate = licenseExpiryDate;
        this.assignedVehicleId = assignedVehicleId;
    }

    public int getDriverId() {
        return driverId;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public Date getLicenseExpiryDate() {
        return licenseExpiryDate;
    }

    public int getAssignedVehicleId() {
        return assignedVehicleId;
    }
}