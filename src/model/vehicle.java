package model;

import java.sql.Date;

public class vehicle {

    private int vehicleId;
    private String vehicleNumber;
    private String vehicleType;
    private Date purchaseDate;
    private Date insuranceExpiryDate;
    private String status;

    public vehicle(int vehicleId, String vehicleNumber,
                   String vehicleType, Date purchaseDate,
                   Date insuranceExpiryDate, String status) {

        this.vehicleId = vehicleId;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.purchaseDate = purchaseDate;
        this.insuranceExpiryDate = insuranceExpiryDate;
        this.status = status;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public Date getInsuranceExpiryDate() {
        return insuranceExpiryDate;
    }

    public String getStatus() {
        return status;
    }
}