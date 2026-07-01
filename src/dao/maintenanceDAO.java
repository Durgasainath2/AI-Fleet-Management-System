package dao;

import database.DBConnection;
import model.maintenance;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class maintenanceDAO {

    // ADD MAINTENANCE
    public void addMaintenance(maintenance m) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "INSERT INTO MAINTENANCE VALUES(?,?,?,?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, m.getMaintenanceId());
            ps.setInt(2, m.getVehicleId());
            ps.setString(3, m.getServiceType());
            ps.setInt(4, m.getCost());
            ps.setDate(5, m.getNextServiceDate());

            ps.executeUpdate();

            System.out.println("Maintenance Added Successfully");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // VIEW MAINTENANCE RECORDS
    public void viewMaintenance() {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM MAINTENANCE";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                        rs.getInt("MAINTENANCE_ID") + " | " +
                                rs.getInt("VEHICLE_ID") + " | " +
                                rs.getString("SERVICE_TYPE") + " | " +
                                rs.getInt("COST") + " | " +
                                rs.getDate("NEXT_SERVICE_DATE")
                );
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // UPDATE MAINTENANCE COST
    public void updateMaintenanceCost(int maintenanceId,
                                      int cost) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "UPDATE MAINTENANCE SET COST=? WHERE MAINTENANCE_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, cost);
            ps.setInt(2, maintenanceId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Maintenance Updated Successfully");
            else
                System.out.println("Maintenance Record Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // DELETE MAINTENANCE RECORD
    public void deleteMaintenance(int maintenanceId) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "DELETE FROM MAINTENANCE WHERE MAINTENANCE_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, maintenanceId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Maintenance Deleted Successfully");
            else
                System.out.println("Maintenance Record Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}