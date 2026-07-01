package model;

import java.sql.Date;

public class maintenance {

    private int maintenanceId;
    private int vehicleId;
    private String serviceType;
    private int cost;
    private Date nextServiceDate;

    public maintenance(int maintenanceId,
                       int vehicleId,
                       String serviceType,
                       int cost,
                       Date nextServiceDate) {

        this.maintenanceId = maintenanceId;
        this.vehicleId = vehicleId;
        this.serviceType = serviceType;
        this.cost = cost;
        this.nextServiceDate = nextServiceDate;
    }

    public int getMaintenanceId() {
        return maintenanceId;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public String getServiceType() {
        return serviceType;
    }

    public int getCost() {
        return cost;
    }

    public Date getNextServiceDate() {
        return nextServiceDate;
    }
}