package dao;

import database.DBConnection;
import model.fuel;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class fuelDAO {

    // ADD FUEL
    public void addFuel(fuel f) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "INSERT INTO FUEL VALUES(?,?,?,?,?)";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, f.getFuelEntryId());
            ps.setInt(2, f.getVehicleId());
            ps.setInt(3, f.getFuelQuantity());
            ps.setInt(4, f.getCost());
            ps.setDate(5, f.getFuelDate());

            ps.executeUpdate();

            System.out.println("Fuel Added Successfully");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // VIEW FUEL RECORDS
    public void viewFuel() {

        try {

            Connection con = DBConnection.getConnection();

            String sql = "SELECT * FROM FUEL";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println(
                        rs.getInt("FUEL_ENTRY_ID") + " | " +
                                rs.getInt("VEHICLE_ID") + " | " +
                                rs.getInt("FUEL_QUANTITY") + " | " +
                                rs.getInt("COST") + " | " +
                                rs.getDate("FUEL_DATE")
                );
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // UPDATE FUEL COST
    public void updateFuelCost(int fuelEntryId,
                               int cost) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "UPDATE FUEL SET COST=? WHERE FUEL_ENTRY_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, cost);
            ps.setInt(2, fuelEntryId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Fuel Updated Successfully");
            else
                System.out.println("Fuel Record Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // DELETE FUEL RECORD
    public void deleteFuel(int fuelEntryId) {

        try {

            Connection con = DBConnection.getConnection();

            String sql =
                    "DELETE FROM FUEL WHERE FUEL_ENTRY_ID=?";

            PreparedStatement ps =
                    con.prepareStatement(sql);

            ps.setInt(1, fuelEntryId);

            int rows = ps.executeUpdate();

            if (rows > 0)
                System.out.println("Fuel Deleted Successfully");
            else
                System.out.println("Fuel Record Not Found");

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}