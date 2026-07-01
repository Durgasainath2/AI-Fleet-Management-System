package model;

import java.sql.Date;

public class fuel {

    private int fuelEntryId;
    private int vehicleId;
    private int fuelQuantity;
    private int cost;
    private Date fuelDate;

    public fuel(int fuelEntryId, int vehicleId,
                int fuelQuantity, int cost,
                Date fuelDate) {

        this.fuelEntryId = fuelEntryId;
        this.vehicleId = vehicleId;
        this.fuelQuantity = fuelQuantity;
        this.cost = cost;
        this.fuelDate = fuelDate;
    }

    public int getFuelEntryId() {
        return fuelEntryId;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public int getFuelQuantity() {
        return fuelQuantity;
    }

    public int getCost() {
        return cost;
    }

    public Date getFuelDate() {
        return fuelDate;
    }
}