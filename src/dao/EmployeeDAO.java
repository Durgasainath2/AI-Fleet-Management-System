package dao;

import database.DBConnection;
import model.Employee;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class EmployeeDAO {

    // Add Employee
    public void addEmployee(Employee employee) {

        String query = "INSERT INTO EMPLOYEE VALUES(?,?,?,?,?,?,SYSDATE)";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(query);

            ps.setString(1, employee.getEmployeeId());
            ps.setString(2, employee.getEmployeeName());
            ps.setString(3, employee.getEmailId());
            ps.setString(4, employee.getPhoneNumber());
            ps.setString(5, employee.getPassword());
            ps.setString(6, employee.getRole());

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Employee Added Successfully");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // View Employees
    public void viewEmployees() {

        String query = "SELECT * FROM EMPLOYEE";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(query);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println("--------------------------");
                System.out.println("Employee ID : "
                        + rs.getString("EMPLOYEE_ID"));
                System.out.println("Name : "
                        + rs.getString("EMPLOYEE_NAME"));
                System.out.println("Email : "
                        + rs.getString("EMAIL_ID"));
                System.out.println("Phone : "
                        + rs.getString("PHONE_NUMBER"));
                System.out.println("Role : "
                        + rs.getString("ROLE"));
                System.out.println("Join Date : "
                        + rs.getDate("JOIN_DATE"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Update Employee Phone
    public void updateEmployeePhone(String employeeId,
                                    String newPhone) {

        String query =
                "UPDATE EMPLOYEE SET PHONE_NUMBER=? WHERE EMPLOYEE_ID=?";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(query);

            ps.setString(1, newPhone);
            ps.setString(2, employeeId);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Employee Updated Successfully");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Delete Employee
    public void deleteEmployee(String employeeId) {

        String query =
                "DELETE FROM EMPLOYEE WHERE EMPLOYEE_ID=?";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(query);

            ps.setString(1, employeeId);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Employee Deleted Successfully");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Login Validation
    public boolean validateLogin(String employeeId,
                                 String password) {

        String query =
                "SELECT * FROM EMPLOYEE WHERE EMPLOYEE_ID=? AND PASSWORD=?";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(query);

            ps.setString(1, employeeId);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            return rs.next();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}