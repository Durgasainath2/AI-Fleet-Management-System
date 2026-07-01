import dao.vehicleDAO;
import dao.driverDAO;
import dao.tripDAO;
import dao.fuelDAO;
import dao.maintenanceDAO;

import model.vehicle;
import model.driver;
import model.trip;
import model.fuel;
import model.maintenance;

import java.sql.Date;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        vehicleDAO vehicleDao = new vehicleDAO();
        driverDAO driverDao = new driverDAO();
        tripDAO tripDao = new tripDAO();
        fuelDAO fuelDao = new fuelDAO();
        maintenanceDAO maintenanceDao = new maintenanceDAO();

        while (true) {

            System.out.println("\n===== Fleet Management System =====");
            System.out.println("1. Vehicle Management");
            System.out.println("2. Driver Management");
            System.out.println("3. Trip Management");
            System.out.println("4. Fuel Management");
            System.out.println("5. Maintenance Management");
            System.out.println("6. Exit");

            System.out.print("Enter Choice: ");
            int choice = sc.nextInt();

            switch (choice) {

                case 1:
                    while (true) {
                        System.out.println("\n--- Vehicle Management ---");
                        System.out.println("1. Add Vehicle");
                        System.out.println("2. View Vehicles");
                        System.out.println("3. Update Vehicle Status");
                        System.out.println("4. Delete Vehicle");
                        System.out.println("5. Back");

                        System.out.print("Enter Choice: ");
                        int vChoice = sc.nextInt();

                        boolean backToMainMenu = false;

                        switch (vChoice) {
                            case 1:
                                System.out.print("Vehicle ID: ");
                                int id = sc.nextInt();
                                sc.nextLine();

                                System.out.print("Vehicle Number: ");
                                String number = sc.nextLine();

                                System.out.print("Vehicle Type: ");
                                String type = sc.nextLine();

                                System.out.print("Purchase Date (yyyy-mm-dd): ");
                                Date purchaseDate = Date.valueOf(sc.next());

                                System.out.print("Insurance Expiry Date (yyyy-mm-dd): ");
                                Date insuranceDate = Date.valueOf(sc.next());

                                sc.nextLine();

                                System.out.print("Status: ");
                                String status = sc.nextLine();

                                vehicle v = new vehicle(id, number, type, purchaseDate, insuranceDate, status);
                                vehicleDao.addVehicle(v);
                                break;

                            case 2:
                                vehicleDao.viewVehicles();
                                break;

                            case 3:
                                System.out.print("Vehicle ID: ");
                                int vehicleId = sc.nextInt();
                                sc.nextLine();

                                System.out.print("New Status: ");
                                String newStatus = sc.nextLine();

                                vehicleDao.updateVehicleStatus(vehicleId, newStatus);
                                break;

                            case 4:
                                System.out.print("Vehicle ID: ");
                                int deleteId = sc.nextInt();
                                vehicleDao.deleteVehicle(deleteId);
                                break;

                            case 5:
                                backToMainMenu = true;
                                break;

                            default:
                                System.out.println("Invalid Choice");
                        }

                        if (backToMainMenu) {
                            break;
                        }
                    }
                    break;

                case 2:
                    while (true) {
                        System.out.println("\n--- Driver Management ---");
                        System.out.println("1. Add Driver");
                        System.out.println("2. View Drivers");
                        System.out.println("3. Update Driver");
                        System.out.println("4. Delete Driver");
                        System.out.println("5. Back");

                        System.out.print("Enter Choice: ");
                        int dChoice = sc.nextInt();

                        switch (dChoice) {
                            case 1:
                                System.out.print("Driver ID: ");
                                int did = sc.nextInt();
                                sc.nextLine();

                                System.out.print("Driver Name: ");
                                String dName = sc.nextLine();

                                System.out.print("Phone Number: ");
                                String dPhone = sc.nextLine();

                                System.out.print("License Number: ");
                                String license = sc.nextLine();

                                System.out.print("License Expiry Date (yyyy-mm-dd): ");
                                Date licenseExpiry = Date.valueOf(sc.next());

                                System.out.print("Assigned Vehicle ID: ");
                                int assignedVehicle = sc.nextInt();

                                driver d = new driver(did, dName, dPhone, license, licenseExpiry, assignedVehicle);
                                driverDao.addDriver(d);
                                break;

                            case 2:
                                driverDao.viewDrivers();
                                break;

                            case 3:
                                System.out.print("Driver ID: ");
                                int updateDid = sc.nextInt();
                                sc.nextLine();

                                System.out.print("New Phone Number: ");
                                String phone = sc.nextLine();

                                driverDao.updateDriverPhone(updateDid, phone);
                                break;

                            case 4:
                                System.out.print("Driver ID: ");
                                int deleteDid = sc.nextInt();
                                driverDao.deleteDriver(deleteDid);
                                break;

                            case 5:
                                break;
                        }

                        if (dChoice == 5)
                            break;
                    }
                    break;

                case 3:
                    while (true) {
                        System.out.println("\n--- Trip Management ---");
                        System.out.println("1. Add Trip");
                        System.out.println("2. View Trips");
                        System.out.println("3. Update Trip");
                        System.out.println("4. Delete Trip");
                        System.out.println("5. Back");

                        System.out.print("Enter Choice: ");
                        int tChoice = sc.nextInt();

                        switch (tChoice) {
                            case 1:
                                System.out.print("Trip ID: ");
                                int tid = sc.nextInt();
                                sc.nextLine();

                                System.out.print("Source Location: ");
                                String source = sc.nextLine();

                                System.out.print("Destination Location: ");
                                String dest = sc.nextLine();

                                System.out.print("Distance (km): ");
                                int tDistance = sc.nextInt();

                                System.out.print("Driver ID: ");
                                int tDriverId = sc.nextInt();

                                System.out.print("Vehicle ID: ");
                                int tVehicleId = sc.nextInt();

                                System.out.print("Start Time/Date (yyyy-mm-dd): ");
                                Date startTime = Date.valueOf(sc.next());

                                System.out.print("End Time/Date (yyyy-mm-dd): ");
                                Date endTime = Date.valueOf(sc.next());

                                trip t = new trip(tid, source, dest, tDistance, tDriverId, tVehicleId, startTime, endTime);
                                tripDao.addTrip(t);
                                break;

                            case 2:
                                tripDao.viewTrips();
                                break;

                            case 3:
                                System.out.print("Trip ID: ");
                                int tripId = sc.nextInt();

                                System.out.print("New Distance: ");
                                int distance = sc.nextInt();

                                tripDao.updateTripDistance(tripId, distance);
                                break;

                            case 4:
                                System.out.print("Trip ID: ");
                                int deleteTrip = sc.nextInt();
                                tripDao.deleteTrip(deleteTrip);
                                break;

                            case 5:
                                break;
                        }

                        if (tChoice == 5)
                            break;
                    }
                    break;

                case 4:
                    while (true) {
                        System.out.println("\n--- Fuel Management ---");
                        System.out.println("1. Add Fuel Log");
                        System.out.println("2. View Fuel");
                        System.out.println("3. Update Fuel");
                        System.out.println("4. Delete Fuel");
                        System.out.println("5. Back");

                        System.out.print("Enter Choice: ");
                        int fChoice = sc.nextInt();

                        switch (fChoice) {
                            case 1:
                                System.out.print("Fuel Entry ID: ");
                                int fid = sc.nextInt();

                                System.out.print("Vehicle ID: ");
                                int fVehicleId = sc.nextInt();

                                System.out.print("Fuel Quantity (Liters): ");
                                int fQuantity = sc.nextInt();

                                System.out.print("Total Cost: ");
                                int fCost = sc.nextInt();

                                System.out.print("Fuel Date (yyyy-mm-dd): ");
                                Date fDate = Date.valueOf(sc.next());

                                fuel f = new fuel(fid, fVehicleId, fQuantity, fCost, fDate);
                                fuelDao.addFuel(f);
                                break;

                            case 2:
                                fuelDao.viewFuel();
                                break;

                            case 3:
                                System.out.print("Fuel Entry ID: ");
                                int fuelId = sc.nextInt();

                                System.out.print("New Cost: ");
                                int cost = sc.nextInt();

                                fuelDao.updateFuelCost(fuelId, cost);
                                break;

                            case 4:
                                System.out.print("Fuel Entry ID: ");
                                int deleteFuel = sc.nextInt();
                                fuelDao.deleteFuel(deleteFuel);
                                break;

                            case 5:
                                break;
                        }

                        if (fChoice == 5)
                            break;
                    }
                    break;

                case 5:
                    while (true) {
                        System.out.println("\n--- Maintenance Management ---");
                        System.out.println("1. Add Maintenance Log");
                        System.out.println("2. View Maintenance");
                        System.out.println("3. Update Maintenance");
                        System.out.println("4. Delete Maintenance");
                        System.out.println("5. Back");

                        System.out.print("Enter Choice: ");
                        int mChoice = sc.nextInt();

                        switch (mChoice) {
                            case 1:
                                System.out.print("Maintenance ID: ");
                                int mid = sc.nextInt();

                                System.out.print("Vehicle ID: ");
                                int mVehicleId = sc.nextInt();
                                sc.nextLine();

                                System.out.print("Service Type: ");
                                String serviceType = sc.nextLine();

                                System.out.print("Total Cost: ");
                                int mCost = sc.nextInt();

                                System.out.print("Next Service Date (yyyy-mm-dd): ");
                                Date nextServiceDate = Date.valueOf(sc.next());

                                maintenance m = new maintenance(mid, mVehicleId, serviceType, mCost, nextServiceDate);
                                maintenanceDao.addMaintenance(m);
                                break;

                            case 2:
                                maintenanceDao.viewMaintenance();
                                break;

                            case 3:
                                System.out.print("Maintenance ID: ");
                                int maintenanceId = sc.nextInt();

                                System.out.print("New Cost: ");
                                int maintenanceCost = sc.nextInt();

                                maintenanceDao.updateMaintenanceCost(maintenanceId, maintenanceCost);
                                break;

                            case 4:
                                System.out.print("Maintenance ID: ");
                                int deleteMaintenance = sc.nextInt();
                                maintenanceDao.deleteMaintenance(deleteMaintenance);
                                break;

                            case 5:
                                break;
                        }

                        if (mChoice == 5)
                            break;
                    }
                    break;

                case 6:
                    System.out.println("Thank You");
                    sc.close();
                    System.exit(0);

                default:
                    System.out.println("Invalid Choice");
            }
        }
    }
}