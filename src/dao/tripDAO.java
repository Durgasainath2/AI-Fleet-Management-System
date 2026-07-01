package dao;

import database.DBConnection;
import model.trip;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class tripDAO {

    // ADD TRIP
    public void addTrip(trip t) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "INSERT INTO TRIP VALUES(?,?,?,?,?,?,?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, t.getTripId());
            ps.setString(2, t.getSourceLocation());
            ps.setString(3, t.getDestinationLocation());
            ps.setInt(4, t.getDistance());
            ps.setInt(5, t.getDriverId());
            ps.setInt(6, t.getVehicleId());
            ps.setDate(7, t.getStartTime());
            ps.setDate(8, t.getEndTime());

            ps.executeUpdate();

            System.out.println("Trip Added Successfully");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // VIEW TRIPS
    public void viewTrips() {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM TRIP";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                        rs.getInt("TRIP_ID") + " | " +
                                rs.getString("SOURCE_LOCATION") + " | " +
                                rs.getString("DESTINATION_LOCATION") + " | " +
                                rs.getInt("DISTANCE") + " | " +
                                rs.getInt("DRIVER_ID") + " | " +
                                rs.getInt("VEHICLE_ID") + " | " +
                                rs.getDate("START_TIME") + " | " +
                                rs.getDate("END_TIME")
                );
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // UPDATE DISTANCE
    public void updateTripDistance(int tripId,
                                   int distance) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "UPDATE TRIP SET DISTANCE=? WHERE TRIP_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, distance);
            ps.setInt(2, tripId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Trip Updated Successfully");
            else
                System.out.println("Trip Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // DELETE TRIP
    public void deleteTrip(int tripId) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "DELETE FROM TRIP WHERE TRIP_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, tripId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Trip Deleted Successfully");
            else
                System.out.println("Trip Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}