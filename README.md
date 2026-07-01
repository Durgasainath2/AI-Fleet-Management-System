[README.md](https://github.com/user-attachments/files/29564023/README.md)
# 🚚 FleetControlX AI — Fleet Management & Vehicle Health Monitoring System

FleetControlX AI is an AI-powered fleet management system that helps organizations efficiently manage vehicles, drivers, trips, fuel, and maintenance through a centralized platform. It uses artificial intelligence to provide predictive maintenance, route optimization, fuel analysis and real-time insights, improving operational efficiency, reducing costs and enhancing fleet safety and performance.

## 🌟 Key Features

*   **📊 Unified Admin Command Center**: Interactive metrics dashboard tracking driver utilization, fuel logs, upcoming maintenance runs and general fleet health.
*   **🚨 Mechanic Dispatch & Repair Workflow**: Integrated dispatch queue. Dispatch mechanics to breakdown sites, update tickets, and track repair tasks in real time.
*   **🛠️ Role-Specific Portals**:
    *   **Admin Console**: Complete command authority, telemetry monitoring, and database management.
    *   **Driver Portal**: Log trips, submit breakdown coordinates, and receive range warnings (alerts when > 60 KM from depot).
    *   **Mechanic Portal**: Focused, stripped-down operational view showing driver contacts and incident coordinates with "complete maintenance" feedback actions.
*   **🔮 AI Diagnostics Engine**: Automatic prognosis prediction, repair cost estimates and vehicle intelligence reports.
*   **🔄 Bi-directional Data Sync**: Client-side storage synchronized with a secure relational SQL model on database changes.


## 🛠️ Technology Stack

*   **Backend**: Spring Boot (v3.5.x), Java 21+, Spring Data JPA, Maven
*   **Database**: Oracle Database (11g/19c XE), JDBC
*   **Frontend**: HTML5, JavaScript,CSS, FontAwesome Icons


## 🚀 Getting Started

### 1. Database Setup
Ensure that your local Oracle XE database service and listener are running:
*   Default database connection URL: `jdbc:oracle:thin:@localhost:1521:XE`
*   Set your credentials inside `fleetmanageent/src/main/resources/application.properties`:
    ```ini
    spring.datasource.username=your_user
    spring.datasource.password=your_password
    ```

### 2. Run in Development Mode
Start the application using the Maven wrapper. Hibernate will automatically create the tables and seed mock data on first startup:
```powershell
cd fleetmanageent
.\mvnw.cmd spring-boot:run
```
Once the server is running, navigate to:
👉 **[http://localhost:8081/index.html](http://localhost:8081/index.html)**

### 3. Package & Run in Production
To build a standalone executable JAR file serving both backend APIs and frontend assets:
```powershell
cd fleetmanageent
.\mvnw.cmd package -DskipTests
java -jar target/fleetmanageent-0.0.1-SNAPSHOT.jar
```

---

## 🔐 Mock Test Credentials

| Portal / View | ID / Username | Default Password |
| :--- | :--- | :--- |
| **Admin Console** | `EMP001` | `admin123` |
| **Mechanic Portal** | `EMP004` | `mechanic123` |
| **Driver Portal** | `DRV001` (or plate `AP39AB1234`) | `driver123` |
| **Manager Portal** | `EMP002` | `manager123` |
| **Dispatcher Portal** | `EMP003` | `dispatcher123` |
