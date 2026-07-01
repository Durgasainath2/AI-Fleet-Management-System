# Project Walkthrough - AI Fleet Management System Frontend

I have successfully redesigned and updated the Single Page Application (SPA) frontend for the **AI-Powered Fleet Management and Vehicle Health Monitoring System**. The dashboard layout matches the visual structure of the portal design, with all student portal and university-specific text replaced by clean, domain-appropriate fleet operations terminology.

---

## 📂 Project Structure & Sync Locations

The updated frontend files are fully synchronized across your project folders:
- **Workspace**: [index.html](file:///C:/Users/user/Documents/antigravity/peaceful-bose/index.html), [styles.css](file:///C:/Users/user/Documents/antigravity/peaceful-bose/styles.css), [app.js](file:///C:/Users/user/Documents/antigravity/peaceful-bose/app.js).
- **Java Project Frontend**: [index.html](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend/index.html), [styles.css](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend/styles.css), [app.js](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend/app.js).
- **Brand Image Assets**: [fleet_logo.png](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend/fleet_logo.png).

---

## 🔐 Credentials for Verification

Use the following credentials in the Login screen:

### Admin Console
- **Employee ID**: `EMP001`
- **Password**: `admin123`

### Mechanic Portal (New)
- **Employee ID**: `EMP004`
- **Password**: `mechanic123`

### Driver Portal
- **Driver ID / Vehicle**: `DRV001` (or plate number `AP39AB1234`)
- **Password**: `driver123`

---

## 🚀 How to Run the Website

You can run the application directly from the local filesystem:
1. Open your File Explorer and navigate to [C:\Users\user\IdeaProjects\FleetManagementSystem\frontend](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend).
2. **Double-click `index.html`** to open it directly in Chrome, Edge, or Firefox.

---

## 🎨 Visual Theme & Component Redesign Highlights

### 1. Brand Logo on Login Page
- Generated a custom high-quality minimalist vector logo (`fleet_logo.png`) representing AI connections and transport trucks.
- Displayed the logo at the top of the sign-in card with a circular mask and hot pink borders.

### 2. Simplified Top Metrics Cards & Grid
- Restructured as a 2-column top grid with rounded cards and teal sub-boxes:
  - **Vehicles & Assets**:
    - **Under Maint.** sub-box: displays count of vehicles Under Maintenance / Inactive (e.g. `1`).
    - **Active** sub-box: displays count of active/operational vehicles (e.g. `4`).
    - **Total** sub-box: displays total registered vehicles (e.g. `5`).
  - **Driver Availability**:
    - **Utilization** sub-box: displays percentage of driver utilization (e.g. `100%`).
    - **Assigned** sub-box: displays count of assigned drivers on trips (e.g. `4`).
    - **Available** sub-box: displays count of unassigned/available drivers (e.g. `0`).
- **Emergency Breakdowns Log** is now placed **full-width** at the bottom of the dashboard.

### 3. Mechanic User & Restricted Portal View
- Added **Rajesh Mechanic** (EMP004) to the default employee database (Role: `MECHANIC`).
- When logging in as Rajesh Mechanic:
  - The navbar action buttons and other sidebar sections are automatically hidden.
  - The portal defaults and locks to the **Emergency Alerts** tab.
  - The mechanic card renders in a highly restricted view displaying **ONLY**:
    - Driver Assigned Name
    - Driver Contact Details (Clickable Phone Link)
    - Incident Location
  - Hides vehicle specs, issue classification types, description notes, photos, and admin action buttons.

### 4. Mechanic Dispatch & Completion Workflow
- **Dispatch Mechanic**: Admin clicking this sends an immediate SMS notification to Rajesh Mechanic's phone, updating the incident log.
- **Maintenance Completed Message**: Rajesh Mechanic can click a button on his card to send a "Maintenance Completed" message to the admin.
- **Close Ticket**: The admin is notified of the mechanic's status and can then resolve and close the ticket, restoring the vehicle status back to `Active`.

### 5. Distance and Range checking (60 KM Depot limit)
- Drivers submitting breakdown reports now specify the **Distance from nearest depot (KM)**.
- If distance is **greater than 60 KM** (e.g. 75 KM):
  - The driver immediately receives a system alert advising them to go to a nearby local mechanic shop.
  - The admin portal flags the ticket as **OUT OF RANGE (> 60 KM)**.

---

## 🛠️ Verification Checklist
1. Log in as driver `DRV001` -> submit a breakdown with distance = 45 KM -> verify it's added.
2. Log in as driver `DRV001` -> submit a breakdown with distance = 75 KM -> verify range warning popup appears.
3. Log in as admin `EMP001` -> go to **Emergency Alerts** -> verify you can see the new breakdown details (including the range alert and driver info).
4. Click **Dispatch Mechanic** -> verify success toast and SMS warning log.
5. Log in as mechanic `EMP004` -> verify only the **Emergency Alerts** view is shown, displaying ONLY the driver's contact details and location, with a button to complete maintenance.
6. Click **Send Maintenance Completed Update** -> log back in as admin `EMP001` and verify the status update is visible, allowing you to resolve and close the ticket.
