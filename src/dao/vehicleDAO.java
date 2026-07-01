package dao;

import database.DBConnection;
import model.vehicle;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class vehicleDAO {

    // ADD VEHICLE
    public void addVehicle(vehicle v) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "INSERT INTO VEHICLE VALUES(?,?,?,?,?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, v.getVehicleId());
            ps.setString(2, v.getVehicleNumber());
            ps.setString(3, v.getVehicleType());
            ps.setDate(4, v.getPurchaseDate());
            ps.setDate(5, v.getInsuranceExpiryDate());
            ps.setString(6, v.getStatus());

            ps.executeUpdate();

            System.out.println("Vehicle Added Successfully");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // VIEW VEHICLES
    public void viewVehicles() {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM VEHICLE";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                        rs.getInt("VEHICLE_ID") + " | " +
                                rs.getString("VEHICLE_NUMBER") + " | " +
                                rs.getString("VEHICLE_TYPE") + " | " +
                                rs.getDate("PURCHASE_DATE") + " | " +
                                rs.getDate("INSURANCE_EXPIRY_DATE") + " | " +
                                rs.getString("STATUS")
                );
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // UPDATE VEHICLE STATUS
    public void updateVehicleStatus(int vehicleId,
                                    String status) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "UPDATE VEHICLE SET STATUS=? WHERE VEHICLE_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setString(1, status);
            ps.setInt(2, vehicleId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Vehicle Updated Successfully");
            else
                System.out.println("Vehicle Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // DELETE VEHICLE
    public void deleteVehicle(int vehicleId) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "DELETE FROM VEHICLE WHERE VEHICLE_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, vehicleId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Vehicle Deleted Successfully");
            else
                System.out.println("Vehicle Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}