package dao;

import database.DBConnection;
import model.driver;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class driverDAO {

    // ADD DRIVER
    public void addDriver(driver d) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "INSERT INTO DRIVER VALUES(?,?,?,?,?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, d.getDriverId());
            ps.setString(2, d.getDriverName());
            ps.setString(3, d.getPhoneNumber());
            ps.setString(4, d.getLicenseNumber());
            ps.setDate(5, d.getLicenseExpiryDate());
            ps.setInt(6, d.getAssignedVehicleId());

            ps.executeUpdate();

            System.out.println("Driver Added Successfully");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // VIEW DRIVERS
    public void viewDrivers() {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM DRIVER";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                        rs.getInt("DRIVER_ID") + " | " +
                                rs.getString("DRIVER_NAME") + " | " +
                                rs.getString("PHONE_NUMBER") + " | " +
                                rs.getString("LICENSE_NUMBER") + " | " +
                                rs.getDate("LICENSE_EXPIRY_DATE") + " | " +
                                rs.getInt("ASSIGNED_VEHICLE_ID")
                );
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // UPDATE DRIVER PHONE NUMBER
    public void updateDriverPhone(int driverId,
                                  String phoneNumber) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "UPDATE DRIVER SET PHONE_NUMBER=? WHERE DRIVER_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(1, phoneNumber);
            ps.setInt(2, driverId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Driver Updated Successfully");
            else
                System.out.println("Driver Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // DELETE DRIVER
    public void deleteDriver(int driverId) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "DELETE FROM DRIVER WHERE DRIVER_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, driverId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Driver Deleted Successfully");
            else
                System.out.println("Driver Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}