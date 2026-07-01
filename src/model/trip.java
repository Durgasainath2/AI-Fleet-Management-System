package model;

import java.sql.Date;

public class trip {

    private int tripId;
    private String sourceLocation;
    private String destinationLocation;
    private int distance;
    private int driverId;
    private int vehicleId;
    private Date startTime;
    private Date endTime;

    public trip(int tripId, String sourceLocation,
                String destinationLocation,
                int distance,
                int driverId,
                int vehicleId,
                Date startTime,
                Date endTime) {

        this.tripId = tripId;
        this.sourceLocation = sourceLocation;
        this.destinationLocation = destinationLocation;
        this.distance = distance;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public int getTripId() {
        return tripId;
    }

    public String getSourceLocation() {
        return sourceLocation;
    }

    public String getDestinationLocation() {
        return destinationLocation;
    }

    public int getDistance() {
        return distance;
    }

    public int getDriverId() {
        return driverId;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public Date getEndTime() {
        return endTime;
    }
}