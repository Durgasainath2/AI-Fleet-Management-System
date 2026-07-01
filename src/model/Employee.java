package model;

public class Employee {

    private String employeeId;
    private String employeeName;
    private String emailId;
    private String phoneNumber;
    private String password;
    private String role;

    public Employee(String employeeId,
                    String employeeName,
                    String emailId,
                    String phoneNumber,
                    String password,
                    String role) {

        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.emailId = emailId;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.role = role;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public String getEmailId() {
        return emailId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}