# Project Walkthrough - FleetControlX AI (Intelligent Fleet Operations Platform)

I have successfully completed the modular frontend redesign for the **FleetControlX AI (Intelligent Fleet Operations Platform)**. The main command dashboard is fully integrated with standalone HTML pages, a dedicated Mechanic Console, interactive Route Optimization simulators, and advanced AI predictive systems (Breakdown diagnostics, Service recommendations, and Cost Savings).

---

## 📂 Project Structure & Sync Locations

The updated frontend files are fully synchronized across your project folders:
- **Workspace**: 
  - Main SPA Portal: [index.html](file:///C:/Users/user/Documents/antigravity/peaceful-bose/index.html), [styles.css](file:///C:/Users/user/Documents/antigravity/peaceful-bose/styles.css), [app.js](file:///C:/Users/user/Documents/antigravity/peaceful-bose/app.js)
  - Standalone Pages: [vehicle-intelligence-report.html](file:///C:/Users/user/Documents/antigravity/peaceful-bose/vehicle-intelligence-report.html), [ai-prediction.html](file:///C:/Users/user/Documents/antigravity/peaceful-bose/ai-prediction.html), [driver-dashboard.html](file:///C:/Users/user/Documents/antigravity/peaceful-bose/driver-dashboard.html), [breakdown-report.html](file:///C:/Users/user/Documents/antigravity/peaceful-bose/breakdown-report.html)
- **Java Project Frontend**: Synchronized copy of all files inside [C:\Users\user\IdeaProjects\FleetManagementSystem\frontend\](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend/)
- **Brand Image Assets**: [fleet_logo.png](file:///C:/Users/user/IdeaProjects/FleetManagementSystem/frontend/fleet_logo.png).

---

## 🔐 Credentials for Verification

Use the following credentials in the Login screen:

### Admin Console
- **Employee ID**: `EMP001`
- **Password**: `admin123`

### Dedicated Mechanic Console (New)
- **Employee ID**: `EMP004`
- **Password**: `mechanic123`

### Driver Portal
- **Driver ID / Vehicle**: `DRV001` (or plate number `AP39AB1234`)
- **Password**: `driver123`

---

## 🚀 How to Run the Website (Hosted via Backend Server)

The Java backend has been upgraded with a built-in HTTP server to serve the frontend:
1. Run the Java application using Command Prompt.
2. Open Chrome and navigate to: **`http://localhost:8082`**

---

## 🎨 New Features & Redesign Highlights

### 1. Modular Standalone Pages
- **`vehicle-intelligence-report.html`**: A merged dossier blending detailed vehicle telemetry, driver profiles, recent trips, fuel fills, maintenance records, and **AI Predictions** (Health Score, Breakdown Risk, Recommended Service Center with 8 KM distance and 2 days repair time, and Cost Savings analysis comparing Today's service cost ₹5,000 vs. ₹18,000 if delayed by 2 months). Has a print stylesheet optimized for **PDF Downloads**.
- **`ai-prediction.html`**: A dedicated search gateway that queries a vehicle number to retrieve its health score, predicted maintenance schedule, breakdown risk level, and cost savings estimate.
- **`driver-dashboard.html`**: A personalized console for drivers containing assigned vehicle specs, active health bar indicator, recent trip dispatches, an interactive **Tirupati ➔ Chennai Route Planner**, service logging forms, and **Profile & Password management** in the top-right dropdown (view driver metadata, update passwords in local storage).
- **`breakdown-report.html`**: A driver breakdown submission page including location, distance, photo upload, and the **AI Breakdown Assistant symptoms lookup** (Engine Noise, Battery, Tyre, Brake diagnostics). Warns drivers if they exceed the 60 KM mechanic coverage range.

### 2. Today's Fleet Status Widget (Command Center)
- Placed on the Admin home page displaying:
  - **Vehicles Active**: 78
  - **Vehicles on Trip**: 45
  - **Vehicles Under Repair**: 8
  - **Emergency Cases**: 2

### 3. Route Optimization Center
- Replaced the GPS tracking sidebar with a **Route Optimization Simulator** in the Admin console.
- Resolves key dispatch presets:
  - **Tirupati ➔ Chennai**: NH716, 135 KM, 2 Hours 45 Mins, ₹850 Fuel Cost, ₹180 Saved.
  - **Hyderabad ➔ Vijayawada**: NH65, 275 KM, 5 Hours 10 Mins, ₹1,850 Fuel Cost, ₹350 Saved.
  - **Bangalore ➔ Chennai**: NH48, 350 KM, 6 Hours 30 Mins, ₹2,400 Fuel Cost, ₹420 Saved.

### 4. Dedicated Mechanic Console
- When logged in as **Rajesh Mechanic** (`EMP004`), he is redirected to the **Mechanic Console** (`#mechanic-dashboard-view`) and restricted to the following tables:
  - **Assigned Repair Work**: Displays regular maintenance jobs assigned to him and emergency dispatches. Rajesh can click "Complete" on regular repairs to enter final billing costs and reset the vehicle to active, or "Send Done Alert" to update the admin on emergency cases.
  - **Fleet Pending Requests**: Allows claiming active vehicle issues.
  - **Completed Repair Logs**: Displays repair history logs and tracks Rajesh's total repair billings (e.g. ₹12,000).

### 5. Expanded AI Chatbot Answers
- Added direct semantic responses for QA queries:
  - *"Which vehicles need service?"*: Identifies AP39AB1234 due tomorrow.
  - *"Show high-risk vehicles"*: Identifies TS09BC8899 (82% risk) and MH12XY1122 (45% risk).
  - *"Show fuel expenses"*: Sums total fleet fuel spending (₹41,250) and names Bangalore-Chennai as the cost-intensive route.

---

## 🛠️ Verification Checklist
1. Log in as **Admin** (`EMP001`) -> view the Fleet Command Center status numbers and rankings.
2. Go to **Route Optimization** -> select Departure `Tirupati`, Destination `Chennai` -> click **Optimize & Dispatch Route**. Verify NH716 metrics are shown.
3. Log in as **Mechanic** (`EMP004`) -> verify redirection to the **Mechanic Repair Console** with active tasks, pending tasks, and completion buttons.
4. Click **Claim Job** or **Complete** on a task -> verify success messages and live updates of repair history totals.
5. Ask the AI assistant chatbot *"Show fuel expenses"* or *"Which vehicles need service?"* -> verify the answers display detailed fleet metrics.
