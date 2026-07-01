/**
 * AI-Powered Fleet Management System - JavaScript Logic
 * 
 * Includes:
 * 1. Mock DB Seeding & LocalStorage state management
 * 2. Auth controller (Admin & Driver Portals)
 * 3. Page switching & UI state navigation
 * 4. CRUD operations for Vehicles, Drivers, Trips, Fuel, Maintenance, Employees
 * 5. Toast alert management & Header Dropdowns (Profile, Notifications SMS)
 * 6. Global Search engine (ID & Number support)
 * 7. AI Prediction Module (ID & Number support)
 * 8. AI Vehicle Report Generator (ID & Number support)
 * 9. Analytics Charting using Chart.js
 * 10. Driver portal breakdown reports & alerts
 * 11. Dedicated Emergency Alerts Center
 * 12. Floating AI Assistant Chatbot
 */

// Global App State
let db = {};
let currentView = 'dashboard';
let loggedInUser = null; // { id, name, role }
let editTarget = null; // Used to track which record is being edited in modal
let activeCharts = {};

// Default Current Time Anchor: 2026-06-22
const SYSTEM_DATE = "2026-06-22";

// Initialize the Database
async function initDatabase() {
  db = await fetchDb();
  
  // Dynamic sync to verify Rajesh Mechanic exists
  let updated = false;
  if (db && db.employees) {
    const hasMechanic = db.employees.some(e => e.role === 'MECHANIC');
    if (!hasMechanic) {
      db.employees.push({ id: "EMP004", name: "Rajesh Mechanic", email: "rajesh@fleet.com", phone: "9876543220", role: "MECHANIC", joinDate: "2026-01-10" });
      if (!db.passwords) db.passwords = {};
      db.passwords["EMP004"] = "mechanic123";
      updated = true;
    }
  }

  // Dynamic sync for repairs database
  if (db && !db.repairs) {
    db.repairs = [
      { id: "REP001", vehicle: "TS09BC8899", description: "Engine Overheating Repair", cost: 12000, status: "Completed", date: "2026-06-22" },
      { id: "REP002", vehicle: "AP39AB1234", description: "Rear Axle Alignment & Suspension check", cost: 8500, status: "Assigned", date: "2026-06-22" },
      { id: "REP003", vehicle: "KA51MB4567", description: "Brake Pad Replacement", cost: 4500, status: "Pending", date: "2026-06-21" }
    ];
    updated = true;
  }
  
  // Make sure passwords list exists in local DB
  if (db && !db.passwords) {
    db.passwords = { "EMP001": "admin123", "EMP004": "mechanic123", "DRV001": "driver123" };
    updated = true;
  }

  if (updated) {
    db = await saveDb(db);
  }
}

async function saveDatabase() {
  // Save locally first to keep UI responsive
  localStorage.setItem('fleet_db', JSON.stringify(db));
  updateDashboardMetrics();
  
  // Then background post to backend server
  try {
    db = await saveDb(db);
  } catch (e) {
    console.error("Background sync failed:", e);
  }
}

async function refreshData() {
  await initDatabase();
  updateDashboardMetrics();
  if (typeof switchView === 'function') {
    switchView(currentView);
  }
  showToast('Refresh Data', 'System databases synced.', 'info');
}

// Helper to look up a vehicle by number or ID
function findVehicleByNumberOrId(query) {
  if (!query) return null;
  const qClean = query.trim().toUpperCase();
  return db.vehicles.find(v => v.id === qClean || v.number.toUpperCase() === qClean);
}

// ==========================================================================
// TOAST NOTIFICATIONS & NAVBAR DROPDOWNS
// ==========================================================================
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-check-circle';
  if (type === 'danger') icon = 'fa-exclamation-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';
  if (type === 'info') icon = 'fa-info-circle';
  
  toast.innerHTML = `
    <i class="fas ${icon} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove toast after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Dropdowns visibility
function toggleProfileDropdown(event) {
  event.stopPropagation();
  const dropdown = loggedInUser && loggedInUser.role === 'DRIVER' 
    ? document.getElementById('profile-dropdown-driver')
    : document.getElementById('profile-dropdown');
  
  document.getElementById('notifications-dropdown').classList.add('d-none');
  dropdown.classList.toggle('d-none');
}

function toggleNotificationsDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('notifications-dropdown');
  const profileDropdown = document.getElementById('profile-dropdown');
  if (profileDropdown) profileDropdown.classList.add('d-none');
  const profileDriverDropdown = document.getElementById('profile-dropdown-driver');
  if (profileDriverDropdown) profileDriverDropdown.classList.add('d-none');
  
  dropdown.classList.toggle('d-none');
  renderNotificationsList();
}

// Close dropdowns on outside click
window.addEventListener('click', () => {
  const prof = document.getElementById('profile-dropdown');
  if (prof) prof.classList.add('d-none');
  const profDrv = document.getElementById('profile-dropdown-driver');
  if (profDrv) profDrv.classList.add('d-none');
  const notif = document.getElementById('notifications-dropdown');
  if (notif) notif.classList.add('d-none');
});

// Render Notifications
function renderNotificationsList() {
  const container = document.getElementById('notifications-list');
  container.innerHTML = '';
  
  if (db.alerts.length === 0) {
    container.innerHTML = '<div class="text-center text-muted py-4">No alerts found.</div>';
    document.getElementById('nav-bell-badge').style.display = 'none';
    return;
  }
  
  document.getElementById('nav-bell-badge').style.display = 'block';
  
  db.alerts.forEach(alert => {
    let icon = 'fa-info-circle';
    if (alert.type === 'danger') icon = 'fa-exclamation-triangle';
    if (alert.type === 'warning') icon = 'fa-exclamation-circle';
    
    const item = document.createElement('div');
    item.className = `notification-dropdown-item ${alert.type}`;
    item.innerHTML = `
      <i class="fas ${icon} notif-icon"></i>
      <div class="notif-body">
        <h5>${alert.title}</h5>
        <p>Vehicle: <strong>${alert.vehicle}</strong> • ${alert.date || '2026-06-22'}</p>
      </div>
    `;
    
    // Clicking an alert navigates to appropriate view
    item.addEventListener('click', () => {
      if (alert.title.toLowerCase().includes('breakdown') || alert.title.toLowerCase().includes('emergency')) {
        switchView('emergency-alerts');
      } else {
        switchView('global-search');
        document.getElementById('global-search-input').value = alert.vehicle;
        executeGlobalSearch();
      }
    });
    
    container.appendChild(item);
  });
}

function clearAllNotifications() {
  db.alerts = [];
  saveDatabase();
  renderNotificationsList();
  renderDashboardAlerts();
  showToast('Notifications Cleared', 'All system SMS alerts cleared.', 'info');
}

// User Profile Dossier Modal
function showProfileDetailsModal() {
  if (!loggedInUser) return;
  
  const avatar = loggedInUser.role === 'DRIVER' ? 'DR' : 'AD';
  const roleText = loggedInUser.role === 'DRIVER' ? 'DRIVER PORTAL' : 'ADMIN CONSOLE';
  
  document.getElementById('prof-modal-avatar').textContent = avatar;
  document.getElementById('prof-modal-avatar').style.backgroundColor = loggedInUser.role === 'DRIVER' ? 'var(--success)' : 'var(--primary)';
  document.getElementById('prof-modal-name').textContent = loggedInUser.name.toUpperCase();
  document.getElementById('prof-modal-badge').textContent = roleText;
  document.getElementById('prof-modal-badge').className = `badge ${loggedInUser.role === 'DRIVER' ? 'badge-success' : 'badge-primary'}`;
  
  document.getElementById('prof-modal-id').textContent = loggedInUser.id;
  
  // Find contact info
  if (loggedInUser.role === 'DRIVER') {
    const drv = db.drivers.find(d => d.id === loggedInUser.id);
    document.getElementById('prof-modal-email').textContent = 'driver_' + loggedInUser.name.toLowerCase() + '@fleet.com';
    document.getElementById('prof-modal-phone').textContent = drv ? drv.phone : 'N/A';
    document.getElementById('prof-modal-vehicle-row').classList.remove('d-none');
    document.getElementById('prof-modal-vehicle').textContent = loggedInUser.vehicle || 'Unassigned';
    document.getElementById('prof-modal-joindate').textContent = '2024-10-12';
  } else {
    const emp = db.employees.find(e => e.id === loggedInUser.id);
    document.getElementById('prof-modal-email').textContent = emp ? emp.email : 'sainath@gmail.com';
    document.getElementById('prof-modal-phone').textContent = emp ? emp.phone : '9876543210';
    document.getElementById('prof-modal-vehicle-row').classList.add('d-none');
    document.getElementById('prof-modal-joindate').textContent = emp ? emp.joinDate : '2024-01-15';
  }
  
  openModal('profile-details-modal');
}

// Change Password Handler
function handlePasswordChange(event) {
  event.preventDefault();
  const oldPass = document.getElementById('cp-old').value;
  const newPass = document.getElementById('cp-new').value;
  const confirmPass = document.getElementById('cp-confirm').value;
  
  const savedPassword = db.passwords[loggedInUser.id] || "admin123";
  
  if (oldPass !== savedPassword) {
    showToast('Validation Error', 'The current password you entered is incorrect.', 'danger');
    return;
  }
  
  if (newPass.length < 6) {
    showToast('Validation Error', 'New password must be at least 6 characters long.', 'warning');
    return;
  }
  
  if (newPass !== confirmPass) {
    showToast('Validation Error', 'New password and confirmation password do not match.', 'danger');
    return;
  }
  
  db.passwords[loggedInUser.id] = newPass;
  saveDatabase();
  closeModal('change-password-modal');
  showToast('Password Updated', 'Your security password has been updated successfully.', 'success');
}

// ==========================================================================
// AUTHENTICATION & LOGIN
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await initDatabase();
  
  // Toggle Auth Type (Admin vs Driver)
  const authToggleBtns = document.querySelectorAll('.auth-toggle-btn');
  const loginRoleField = document.getElementById('login-role');
  const loginUserLabel = document.getElementById('login-user-label');
  const loginUserPlaceholder = document.getElementById('employee-id');
  const adminLinks = document.getElementById('admin-links');
  
  authToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      authToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role;
      loginRoleField.value = role;
      
      if (role === 'DRIVER') {
        loginUserLabel.textContent = "Driver ID / Vehicle Number";
        loginUserPlaceholder.placeholder = "e.g. DRV001 or AP39AB1234";
        adminLinks.classList.add('d-none');
        loginUserPlaceholder.value = "";
        document.getElementById('password').value = "";
      } else {
        loginUserLabel.textContent = "Employee ID";
        loginUserPlaceholder.placeholder = "e.g. EMP001";
        adminLinks.classList.remove('d-none');
        loginUserPlaceholder.value = "";
        document.getElementById('password').value = "";
      }
    });
  });

  // Login form submission
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('employee-id').value.trim();
    const passVal = document.getElementById('password').value.trim();
    const roleVal = loginRoleField.value;
    
    const savedPassword = db.passwords[idVal] || (roleVal === 'ADMIN' ? 'admin123' : 'driver123');
    
    if (roleVal === 'ADMIN') {
      const employee = db.employees.find(emp => emp.id === idVal);
      if (idVal === 'EMP001' && passVal === savedPassword) {
        loginSuccess({ id: 'EMP001', name: 'Sainath', role: 'ADMIN' });
      } else if (employee && passVal === savedPassword) {
        loginSuccess({ id: employee.id, name: employee.name, role: employee.role });
      } else {
        loginFail();
      }
    } else {
      const driver = db.drivers.find(drv => drv.id === idVal || drv.assignedVehicle === idVal);
      if (driver && passVal === savedPassword) {
        loginSuccess({ id: driver.id, name: driver.name, role: 'DRIVER', vehicle: driver.assignedVehicle });
      } else if (idVal === 'DRV001' && passVal === savedPassword) {
        loginSuccess({ id: 'DRV001', name: 'Ramesh', role: 'DRIVER', vehicle: 'AP39AB1234' });
      } else {
        loginFail();
      }
    }
  });
  
  checkSession();
  startSessionTimer();

  // Hitting Enter on GPS search
  const gpsSearchInput = document.getElementById('gps-vehicle-search-input');
  if (gpsSearchInput) {
    gpsSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchVehicleGPS();
      }
    });
  }
});

let sessionTimerInterval = null;
function startSessionTimer() {
  if (sessionTimerInterval) clearInterval(sessionTimerInterval);
  let totalSeconds = 9 * 60 + 38; // Start at 09m:38s to match G-Student image exactly
  
  const clockEl = document.getElementById('session-countdown-clock');
  if (!clockEl) return;
  
  sessionTimerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      totalSeconds = 10 * 60; // reset to 10 min
    }
    totalSeconds--;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    clockEl.textContent = `${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
  }, 1000);
}


function loginSuccess(user) {
  loggedInUser = user;
  sessionStorage.setItem('fleet_user', JSON.stringify(user));
  localStorage.setItem('fleet_user', JSON.stringify(user));
  
  if (user.role === 'DRIVER') {
    window.location.href = "driver-dashboard.html";
    return;
  }
  
  showToast('Login Successful', `Welcome back, ${user.name}!`, 'success');
  
  document.getElementById('auth-screen').classList.add('d-none');
  
  document.getElementById('admin-screen').classList.remove('d-none');
  document.getElementById('driver-portal-screen').classList.add('d-none');
  document.getElementById('logged-in-username').textContent = `Welcome, ${user.name} 👤`;
  
  // Update navbar avatar
  const initials = user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  document.getElementById('nav-avatar').textContent = initials;
  document.getElementById('prof-drop-avatar').textContent = initials;
  document.getElementById('prof-drop-name').textContent = user.name.toUpperCase();
  document.getElementById('prof-drop-role').textContent = `${user.role} (${user.id})`;
  
  // Role-based sidebar menu visibility for Mechanic
  if (user.role === 'MECHANIC') {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.dataset.view === 'mechanic-dashboard' || item.dataset.view === 'emergency-alerts') {
        item.classList.remove('d-none');
      } else {
        item.classList.add('d-none');
      }
    });
    // Hide quick navbar actions for mechanic
    document.querySelectorAll('.nav-actions-container .navbar-btn').forEach(btn => btn.classList.add('d-none'));
    switchView('mechanic-dashboard');
  } else {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.dataset.view === 'mechanic-dashboard') {
        item.classList.add('d-none');
      } else {
        item.classList.remove('d-none');
      }
    });
    document.querySelectorAll('.nav-actions-container .navbar-btn').forEach(btn => btn.classList.remove('d-none'));
    switchView('dashboard');
  }
  
  // Dynamic sync alert badges
  renderNotificationsList();
}

function loginFail() {
  showToast('Invalid Credentials', 'The User ID or Password you entered is incorrect.', 'danger');
}

function checkSession() {
  const sessionUser = sessionStorage.getItem('fleet_user');
  if (sessionUser) {
    const user = JSON.parse(sessionUser);
    if (user.role === 'DRIVER') {
      window.location.href = "driver-dashboard.html";
      return;
    }
    loginSuccess(user);
  } else {
    const isNavigation = document.referrer && (
      document.referrer.includes('vehicle-intelligence') ||
      document.referrer.includes('ai-prediction') ||
      document.referrer.includes('driver-dashboard') ||
      document.referrer.includes('breakdown-report') ||
      document.referrer.includes('index.html')
    );
    
    const localUser = localStorage.getItem('fleet_user');
    if (isNavigation && localUser) {
      const user = JSON.parse(localUser);
      sessionStorage.setItem('fleet_user', JSON.stringify(user));
      if (user.role === 'DRIVER') {
        window.location.href = "driver-dashboard.html";
        return;
      }
      loginSuccess(user);
    } else {
      localStorage.removeItem('fleet_user');
      document.getElementById('auth-screen').classList.remove('d-none');
      document.getElementById('admin-screen').classList.add('d-none');
      document.getElementById('driver-portal-screen').classList.add('d-none');
    }
  }
}

function logout() {
  sessionStorage.removeItem('fleet_user');
  localStorage.removeItem('fleet_user');
  loggedInUser = null;
  showToast('Logged Out', 'You have been successfully logged out.', 'info');
  document.getElementById('auth-screen').classList.remove('d-none');
  document.getElementById('admin-screen').classList.add('d-none');
  document.getElementById('driver-portal-screen').classList.add('d-none');
  
  // Clear forms
  document.getElementById('login-form').reset();
  
  // Close chat if open
  document.getElementById('ai-chat-window').classList.add('d-none');
}

// ==========================================================================
// VIEWS ROUTER
// ==========================================================================
function switchView(viewId) {
  currentView = viewId;
  
  // Update sidebar active classes
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Hide all views
  const views = document.querySelectorAll('.view-section');
  views.forEach(view => view.classList.add('d-none'));
  
  // Show active view
  const activeView = document.getElementById(`${viewId}-view`);
  if (activeView) {
    activeView.classList.remove('d-none');
  }
  
  // Handle mobile menu drawer close
  document.getElementById('sidebar').classList.remove('mobile-active');
  
  // Load view-specific modules
  if (viewId === 'dashboard') {
    updateDashboardMetrics();
    renderDashboardAlerts();
  } else if (viewId === 'vehicle') {
    renderVehicleTable();
  } else if (viewId === 'driver') {
    renderDriverTable();
  } else if (viewId === 'trip') {
    renderTripTable();
  } else if (viewId === 'fuel') {
    renderFuelTable();
  } else if (viewId === 'maintenance') {
    renderMaintenanceTable();
  } else if (viewId === 'employee') {
    renderEmployeeTable();
  } else if (viewId === 'emergency-alerts') {
    renderEmergencyAlerts();
  } else if (viewId === 'ai-prediction') {
    initAIPredictions();
  } else if (viewId === 'vehicle-reports') {
    initReportGenerator();
  } else if (viewId === 'global-search') {
    initGlobalSearch();
  } else if (viewId === 'analytics') {
    initAnalyticsCharts();
  } else if (viewId === 'mechanic-dashboard') {
    renderMechanicDashboard();
  }
}

// Sidebar toggle for mobile
function toggleMobileMenu() {
  document.getElementById('sidebar').classList.toggle('mobile-active');
}

// ==========================================================================
// DASHBOARD VIEW
// ==========================================================================
function getVehicleHealthScore(vehicle) {
  if (vehicle.status === 'Under Maintenance') return 45;
  
  // Check active breakdown
  const activeBreakdown = db.breakdowns ? db.breakdowns.find(b => (b.vehicle === vehicle.number || b.vehicle === vehicle.id) && b.status === 'Pending') : null;
  if (activeBreakdown) return 40;
  
  // Check active repair
  const activeRepair = db.repairs ? db.repairs.find(r => (r.vehicle === vehicle.number || r.vehicle === vehicle.id) && r.status === 'Assigned') : null;
  if (activeRepair) return 60;
  
  // Check alerts
  const alerts = db.alerts ? db.alerts.filter(a => a.vehicle === vehicle.number || a.vehicle === vehicle.id) : [];
  const hasDanger = alerts.some(a => a.type === 'danger');
  const hasWarning = alerts.some(a => a.type === 'warning');
  if (hasDanger) return 75;
  if (hasWarning) return 82;
  
  if (vehicle.number === 'AP39AB1234') return 78;
  
  return 95; // Default healthy
}

function updateDashboardMetrics() {
  const totalVehicles = db.vehicles.length;
  const totalDrivers = db.drivers.length;
  
  const assignedVehicles = db.drivers.filter(d => d.assignedVehicle && d.assignedVehicle.trim() !== '').length;
  const activeVehicles = db.vehicles.filter(v => v.status === 'Active').length;
  const maintVehicles = db.vehicles.filter(v => v.status === 'Under Maintenance').length;
  const pendingVehicles = db.vehicles.filter(v => v.status === 'Inactive' || v.status === 'Under Maintenance').length;
  const emergencyBreakdowns = db.breakdowns.filter(b => b.status === 'Pending').length;
  
  // Update Widget 1: Today's Fleet Status
  const dashActiveEl = document.getElementById('dash-active-vehicles');
  const dashOnTripEl = document.getElementById('dash-ontrip-vehicles');
  const dashRepairEl = document.getElementById('dash-repair-vehicles');
  const dashEmergEl = document.getElementById('dash-emerg-count');

  if (dashActiveEl) dashActiveEl.textContent = activeVehicles;
  if (dashOnTripEl) dashOnTripEl.textContent = assignedVehicles;
  if (dashRepairEl) dashRepairEl.textContent = maintVehicles;
  if (dashEmergEl) dashEmergEl.textContent = emergencyBreakdowns;

  // Calculate average health rating
  let sumHealth = 0;
  db.vehicles.forEach(v => {
    sumHealth += getVehicleHealthScore(v);
  });
  const avgHealthVal = totalVehicles > 0 ? (sumHealth / totalVehicles) : 90;
  const sgpaVal = (avgHealthVal / 10).toFixed(2); // Convert to 10-point scale

  // Update Widget 2: Fleet Health Dashboard
  const dashHealthCircleEl = document.getElementById('dash-health-circle');
  const dashHealthyEl = document.getElementById('dash-healthy-count');
  const dashHighRiskEl = document.getElementById('dash-highrisk-count');
  const dashDueServEl = document.getElementById('dash-dueserv-count');

  const healthVal = Math.round(avgHealthVal);
  if (dashHealthCircleEl) {
    dashHealthCircleEl.textContent = `${healthVal}%`;
    dashHealthCircleEl.style.background = `radial-gradient(circle, #ffffff 55%, transparent 56%), conic-gradient(var(--success) ${healthVal}%, #e2e8f0 0)`;
  }
  
  if (dashHealthyEl) dashHealthyEl.textContent = activeVehicles;
  if (dashHighRiskEl) dashHighRiskEl.textContent = emergencyBreakdowns;
  
  const dueServCount = db.alerts ? db.alerts.filter(a => a.type === 'danger' || a.title.toLowerCase().includes('due')).length : 0;
  if (dashDueServEl) dashDueServEl.textContent = dueServCount;
  
  // 1. Leaves & Permissions (Vehicles & Assets)
  const pendingEl = document.getElementById('metric-pending-vehicles');
  const approvedEl = document.getElementById('metric-approved-vehicles');
  const totalVehEl = document.getElementById('metric-total-vehicles');
  
  if (pendingEl) pendingEl.textContent = pendingVehicles;
  if (approvedEl) approvedEl.textContent = activeVehicles;
  if (totalVehEl) totalVehEl.textContent = totalVehicles;

  // 2. Driver Availability (Drivers Stats)
  const utilizationRate = totalDrivers > 0 ? Math.round((assignedVehicles / totalDrivers) * 100) : 100;
  const utilEl = document.getElementById('metric-driver-utilization');
  const presentEl = document.getElementById('metric-drivers-present');
  const absentEl = document.getElementById('metric-drivers-absent');
  
  if (utilEl) utilEl.textContent = `${utilizationRate}%`;
  if (presentEl) presentEl.textContent = assignedVehicles;
  if (absentEl) absentEl.textContent = totalDrivers - assignedVehicles;

  // 3. Fleet Diagnostics (Trip & Health Ratings)
  const avgRatingEl = document.getElementById('metric-avg-rating');
  const avgHealthEl = document.getElementById('metric-avg-health');
  
  if (avgRatingEl) avgRatingEl.textContent = "4.8"; // Driver rating score
  if (avgHealthEl) avgHealthEl.textContent = sgpaVal; // Health index score

  // 4. Populate breakdown table (Emergency Breakdowns Log)
  const breakdownTbody = document.getElementById('cats-breakdown-table-body');
  if (breakdownTbody) {
    const activeBreakdowns = db.breakdowns.filter(b => b.status === 'Pending');
    breakdownTbody.innerHTML = activeBreakdowns.slice(0, 5).map((b, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${b.date || SYSTEM_DATE}</td>
        <td><span class="text-danger" style="font-weight: 600;"><i class="fas fa-exclamation-triangle"></i> ${b.location.substring(0, 20)}${b.location.length > 20 ? '...' : ''}</span></td>
      </tr>
    `).join('') || '<tr><td colspan="3" class="text-center text-muted">No active breakdown alerts.</td></tr>';
  }

  // 5. Populate fuel table (Recent Fuel Transactions)
  const fuelTbody = document.getElementById('cats-fuel-table-body');
  if (fuelTbody) {
    const sortedFuel = [...db.fuel].sort((a,b) => new Date(b.date) - new Date(a.date));
    fuelTbody.innerHTML = sortedFuel.slice(0, 5).map((f, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${f.date}</td>
        <td>${f.cost.toLocaleString()} ₹</td>
      </tr>
    `).join('') || '<tr><td colspan="3" class="text-center text-muted">No fuel logs found.</td></tr>';
  }

  // 6. Populate maintenance table (Recent Maintenance Bills)
  const maintTbody = document.getElementById('cats-maint-table-body');
  if (maintTbody) {
    const sortedMaint = [...db.maintenance].sort((a,b) => new Date(b.nextDate) - new Date(a.nextDate));
    maintTbody.innerHTML = sortedMaint.slice(0, 5).map((m, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${m.nextDate}</td>
        <td>${m.cost.toLocaleString()} ₹</td>
      </tr>
    `).join('') || '<tr><td colspan="3" class="text-center text-muted">No maintenance logs.</td></tr>';
  }

  // Sidebar counter update
  const sidebarCounter = document.getElementById('sidebar-alert-counter');
  if (sidebarCounter) {
    if (emergencyBreakdowns > 0) {
      sidebarCounter.textContent = emergencyBreakdowns;
      sidebarCounter.style.display = 'inline-block';
    } else {
      sidebarCounter.style.display = 'none';
    }
  }

  // Dynamic Fleet Performance Rankings
  const topAssetsListEl = document.getElementById('dash-top-assets-list');
  const highRiskListEl = document.getElementById('dash-high-risk-list');
  if (topAssetsListEl && highRiskListEl && db.vehicles) {
    const vehiclesWithScores = db.vehicles.map(v => ({
      vehicle: v,
      score: getVehicleHealthScore(v)
    }));
    
    // Sort descending for Top Assets
    const sortedTop = [...vehiclesWithScores].sort((a, b) => b.score - a.score);
    // Sort ascending for High Risk Assets
    const sortedRisk = [...vehiclesWithScores].sort((a, b) => a.score - b.score);
    
    topAssetsListEl.innerHTML = sortedTop.slice(0, 3).map(item => `
      <li style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
        <span><i class="fas fa-truck text-success" style="margin-right: 6px;"></i><strong>${item.vehicle.number}</strong></span>
        <span style="color: var(--success); font-weight: 700;">${item.score}%</span>
      </li>
    `).join('') || '<li style="text-align: center; color: var(--text-muted); padding: 5px;">No assets</li>';
    
    highRiskListEl.innerHTML = sortedRisk.slice(0, 3).map(item => `
      <li style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
        <span><i class="fas fa-exclamation-triangle text-danger" style="margin-right: 6px;"></i><strong>${item.vehicle.number}</strong></span>
        <span style="color: var(--danger); font-weight: 700;">${item.score}%</span>
      </li>
    `).join('') || '<li style="text-align: center; color: var(--text-muted); padding: 5px;">No assets</li>';
  }

  // Populate dynamic alerts in Widget 3
  renderDashboardAlerts();
}

function renderDashboardAlerts() {
  const container = document.getElementById('dash-smart-alerts-list');
  if (!container) return;
  container.innerHTML = '';
  
  if (!db.alerts || db.alerts.length === 0) {
    container.innerHTML = '<div class="text-center text-muted py-3" style="font-size: 0.8rem;">No active alerts.</div>';
    return;
  }
  
  db.alerts.forEach(alert => {
    let alertColor = 'var(--info)';
    let alertBg = 'var(--info-bg)';
    let icon = 'fa-info-circle';
    if (alert.type === 'danger') {
      alertColor = 'var(--danger)';
      alertBg = 'var(--danger-bg)';
      icon = 'fa-exclamation-triangle';
    } else if (alert.type === 'warning') {
      alertColor = 'var(--warning)';
      alertBg = 'var(--warning-bg)';
      icon = 'fa-exclamation-circle';
    }
    
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '10px';
    row.style.padding = '8px 12px';
    row.style.borderRadius = '8px';
    row.style.border = `1px solid ${alertColor}33`;
    row.style.backgroundColor = alertBg;
    row.style.fontSize = '0.8rem';
    row.style.cursor = 'pointer';
    row.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    
    row.innerHTML = `
      <i class="fas ${icon}" style="color: ${alertColor}; font-size: 1rem;"></i>
      <div style="flex: 1;">
        <div style="font-weight: 700; color: var(--text-main);">${alert.title}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted);">Vehicle: <strong>${alert.vehicle}</strong> • ${alert.date || '2026-06-22'}</div>
      </div>
    `;
    
    row.addEventListener('mouseover', () => {
      row.style.transform = 'translateY(-1px)';
      row.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    });
    row.addEventListener('mouseout', () => {
      row.style.transform = 'none';
      row.style.boxShadow = 'none';
    });
    
    row.addEventListener('click', () => {
      if (alert.title.toLowerCase().includes('breakdown') || alert.title.toLowerCase().includes('emergency')) {
        switchView('emergency-alerts');
      } else {
        switchView('global-search');
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.value = alert.vehicle;
          executeGlobalSearch();
        }
      }
    });
    
    container.appendChild(row);
  });
}

// ==========================================================================
// CRUD OPERATIONS
// ==========================================================================

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
  editTarget = null;
  // Reset forms
  const form = document.querySelector(`#${modalId} form`);
  if (form) form.reset();
}

// --- VEHICLE MANAGEMENT CRUD ---
function renderVehicleTable(searchQuery = '') {
  const tbody = document.getElementById('vehicle-table-body');
  tbody.innerHTML = '';
  
  const filtered = db.vehicles.filter(v => 
    v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No vehicles found.</td></tr>`;
    return;
  }
  
  filtered.forEach(v => {
    let statusClass = 'badge-secondary';
    if (v.status === 'Active') statusClass = 'badge-success';
    if (v.status === 'Under Maintenance') statusClass = 'badge-warning';
    if (v.status === 'Inactive') statusClass = 'badge-danger';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${v.id}</strong></td>
      <td><span class="badge badge-secondary" style="font-size: 0.85rem;">${v.number}</span></td>
      <td>${v.type}</td>
      <td>${v.purchaseDate}</td>
      <td>${v.insuranceExpiry}</td>
      <td><span class="badge ${statusClass}">${v.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editVehicle('${v.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteVehicle('${v.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveVehicleForm(event) {
  event.preventDefault();
  const id = document.getElementById('v-id').value;
  const number = document.getElementById('v-number').value.toUpperCase().trim();
  const type = document.getElementById('v-type').value;
  const purchaseDate = document.getElementById('v-purchase-date').value;
  const insuranceExpiry = document.getElementById('v-insurance-date').value;
  const status = document.getElementById('v-status').value;
  
  if (editTarget) {
    const index = db.vehicles.findIndex(v => v.id === editTarget);
    if (index !== -1) {
      db.vehicles[index] = { id: editTarget, number, type, purchaseDate, insuranceExpiry, status };
      showToast('Vehicle Updated', `Vehicle ${number} details updated.`, 'success');
    }
  } else {
    const finalId = id || (Math.max(...db.vehicles.map(v => parseInt(v.id)), 0) + 1).toString();
    db.vehicles.push({ id: finalId, number, type, purchaseDate, insuranceExpiry, status });
    showToast('Vehicle Added', `Vehicle ${number} added to fleet.`, 'success');
  }
  
  saveDatabase();
  closeModal('vehicle-modal');
  renderVehicleTable();
}

function editVehicle(id) {
  const v = db.vehicles.find(item => item.id === id);
  if (!v) return;
  
  editTarget = id;
  document.getElementById('modal-vehicle-title').textContent = 'Update Vehicle Info';
  
  document.getElementById('v-id').value = v.id;
  document.getElementById('v-id').disabled = true;
  document.getElementById('v-number').value = v.number;
  document.getElementById('v-type').value = v.type;
  document.getElementById('v-purchase-date').value = v.purchaseDate;
  document.getElementById('v-insurance-date').value = v.insuranceExpiry;
  document.getElementById('v-status').value = v.status;
  
  openModal('vehicle-modal');
}

function deleteVehicle(id) {
  const v = db.vehicles.find(item => item.id === id);
  if (!v) return;
  
  if (confirm(`Are you sure you want to delete vehicle ${v.number}?`)) {
    db.vehicles = db.vehicles.filter(item => item.id !== id);
    db.drivers.forEach(d => {
      if (d.assignedVehicle === v.number) d.assignedVehicle = '';
    });
    if (window.deletedIds) {
      window.deletedIds.deletedVehicleIds.push(id);
    }
    showToast('Vehicle Removed', `Vehicle ${v.number} deleted.`, 'danger');
    saveDatabase();
    renderVehicleTable();
  }
}

// --- DRIVER MANAGEMENT CRUD ---
function renderDriverTable(searchQuery = '') {
  const tbody = document.getElementById('driver-table-body');
  tbody.innerHTML = '';
  
  const filtered = db.drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.assignedVehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No drivers found.</td></tr>`;
    return;
  }
  
  filtered.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.id}</strong></td>
      <td>${d.name}</td>
      <td>${d.phone}</td>
      <td>${d.licenseNumber}</td>
      <td>${d.licenseExpiry}</td>
      <td><span class="badge badge-info">${d.assignedVehicle || 'Unassigned'}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editDriver('${d.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteDriver('${d.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function populateVehicleSelect(selectId, selectedVal) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">Unassigned</option>';
  db.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.number;
    opt.textContent = `${v.number} (${v.type})`;
    if (v.number === selectedVal) opt.selected = true;
    select.appendChild(opt);
  });
}

function openDriverAddModal() {
  document.getElementById('modal-driver-title').textContent = 'Add New Driver';
  populateVehicleSelect('d-vehicle', '');
  openModal('driver-modal');
}

function saveDriverForm(event) {
  event.preventDefault();
  const idVal = document.getElementById('d-id').value.trim();
  const name = document.getElementById('d-name').value.trim();
  const phone = document.getElementById('d-phone').value.trim();
  const licenseNumber = document.getElementById('d-license').value.trim();
  const licenseExpiry = document.getElementById('d-license-expiry').value;
  const assignedVehicle = document.getElementById('d-vehicle').value;
  
  if (editTarget) {
    const index = db.drivers.findIndex(d => d.id === editTarget);
    if (index !== -1) {
      db.drivers[index] = { id: editTarget, name, phone, licenseNumber, licenseExpiry, assignedVehicle };
      showToast('Driver Updated', `Driver ${name} updated.`, 'success');
    }
  } else {
    const finalId = idVal || "DRV" + String(db.drivers.length + 1).padStart(3, '0');
    if (db.drivers.some(d => d.id === finalId)) {
      showToast('Error', `Driver ID ${finalId} already exists.`, 'danger');
      return;
    }
    db.drivers.push({ id: finalId, name, phone, licenseNumber, licenseExpiry, assignedVehicle });
    showToast('Driver Added', `Driver ${name} registered.`, 'success');
  }
  
  saveDatabase();
  closeModal('driver-modal');
  renderDriverTable();
}

function editDriver(id) {
  const d = db.drivers.find(item => item.id === id);
  if (!d) return;
  
  editTarget = id;
  document.getElementById('modal-driver-title').textContent = 'Update Driver Info';
  
  document.getElementById('d-id').value = d.id;
  document.getElementById('d-id').disabled = true;
  document.getElementById('d-name').value = d.name;
  document.getElementById('d-phone').value = d.phone;
  document.getElementById('d-license').value = d.licenseNumber;
  document.getElementById('d-license-expiry').value = d.licenseExpiry;
  
  populateVehicleSelect('d-vehicle', d.assignedVehicle);
  openModal('driver-modal');
}

function deleteDriver(id) {
  const d = db.drivers.find(item => item.id === id);
  if (!d) return;
  
  if (confirm(`Delete driver record for ${d.name}?`)) {
    db.drivers = db.drivers.filter(item => item.id !== id);
    if (window.deletedIds) {
      window.deletedIds.deletedDriverIds.push(id);
    }
    showToast('Driver Removed', `Driver record deleted.`, 'danger');
    saveDatabase();
    renderDriverTable();
  }
}

// --- TRIP MANAGEMENT CRUD ---
function renderTripTable(searchQuery = '') {
  const tbody = document.getElementById('trip-table-body');
  tbody.innerHTML = '';
  
  const filtered = db.trips.filter(t => 
    t.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No trip records found.</td></tr>`;
    return;
  }
  
  filtered.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${t.id}</strong></td>
      <td>${t.source}</td>
      <td>${t.destination}</td>
      <td>${t.distance} KM</td>
      <td>${t.driver}</td>
      <td><span class="badge badge-secondary">${t.vehicle}</span></td>
      <td>${t.date}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editTrip('${t.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteTrip('${t.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openTripAddModal() {
  document.getElementById('modal-trip-title').textContent = 'Log New Trip';
  
  const dSelect = document.getElementById('t-driver');
  dSelect.innerHTML = '';
  db.drivers.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.name;
    opt.textContent = d.name;
    dSelect.appendChild(opt);
  });
  
  const vSelect = document.getElementById('t-vehicle');
  vSelect.innerHTML = '';
  db.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.number;
    opt.textContent = v.number;
    vSelect.appendChild(opt);
  });
  
  openModal('trip-modal');
}

function saveTripForm(event) {
  event.preventDefault();
  const source = document.getElementById('t-source').value.trim();
  const dest = document.getElementById('t-destination').value.trim();
  const dist = parseInt(document.getElementById('t-distance').value);
  const driver = document.getElementById('t-driver').value;
  const vehicle = document.getElementById('t-vehicle').value;
  const date = document.getElementById('t-date').value;
  
  if (editTarget) {
    const index = db.trips.findIndex(t => t.id === editTarget);
    if (index !== -1) {
      db.trips[index] = { id: editTarget, source, destination: dest, distance: dist, driver, vehicle, date };
      showToast('Trip Updated', `Trip ${editTarget} updated.`, 'success');
    }
  } else {
    const finalId = "TRP" + String(db.trips.length + 1).padStart(3, '0');
    db.trips.push({ id: finalId, source, destination: dest, distance: dist, driver, vehicle, date });
    showToast('Trip Logged', 'Trip successfully recorded.', 'success');
  }
  
  saveDatabase();
  closeModal('trip-modal');
  renderTripTable();
}

function editTrip(id) {
  const t = db.trips.find(item => item.id === id);
  if (!t) return;
  
  editTarget = id;
  document.getElementById('modal-trip-title').textContent = 'Edit Trip Details';
  
  openTripAddModal();
  
  document.getElementById('t-source').value = t.source;
  document.getElementById('t-destination').value = t.destination;
  document.getElementById('t-distance').value = t.distance;
  document.getElementById('t-driver').value = t.driver;
  document.getElementById('t-vehicle').value = t.vehicle;
  document.getElementById('t-date').value = t.date;
  
  openModal('trip-modal');
}

function deleteTrip(id) {
  if (confirm(`Delete trip record ${id}?`)) {
    db.trips = db.trips.filter(t => t.id !== id);
    if (window.deletedIds) {
      window.deletedIds.deletedTripIds.push(id);
    }
    showToast('Trip Deleted', 'Trip record removed.', 'danger');
    saveDatabase();
    renderTripTable();
  }
}

// --- FUEL MANAGEMENT CRUD ---
function renderFuelTable(searchQuery = '') {
  const tbody = document.getElementById('fuel-table-body');
  tbody.innerHTML = '';
  
  const filtered = db.fuel.filter(f => 
    f.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No fuel entries found.</td></tr>`;
    return;
  }
  
  filtered.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${f.id}</strong></td>
      <td><span class="badge badge-secondary">${f.vehicle}</span></td>
      <td>${f.quantity} Liters</td>
      <td>₹${f.cost}</td>
      <td>${f.date}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editFuel('${f.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteFuel('${f.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openFuelAddModal() {
  document.getElementById('modal-fuel-title').textContent = 'New Fuel Entry';
  
  const vSelect = document.getElementById('f-vehicle');
  vSelect.innerHTML = '';
  db.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.number;
    opt.textContent = v.number;
    vSelect.appendChild(opt);
  });
  
  openModal('fuel-modal');
}

function saveFuelForm(event) {
  event.preventDefault();
  const vehicle = document.getElementById('f-vehicle').value;
  const qty = parseFloat(document.getElementById('f-quantity').value);
  const cost = parseFloat(document.getElementById('f-cost').value);
  const date = document.getElementById('f-date').value;
  
  if (editTarget) {
    const index = db.fuel.findIndex(f => f.id === editTarget);
    if (index !== -1) {
      db.fuel[index] = { id: editTarget, vehicle, quantity: qty, cost, date };
      showToast('Fuel Entry Updated', `Entry ${editTarget} updated.`, 'success');
    }
  } else {
    const finalId = "FL" + String(db.fuel.length + 1).padStart(3, '0');
    db.fuel.push({ id: finalId, vehicle, quantity: qty, cost, date });
    showToast('Fuel Logged', 'Fuel purchase logged successfully.', 'success');
  }
  
  saveDatabase();
  closeModal('fuel-modal');
  renderFuelTable();
}

function editFuel(id) {
  const f = db.fuel.find(item => item.id === id);
  if (!f) return;
  
  editTarget = id;
  document.getElementById('modal-fuel-title').textContent = 'Edit Fuel Entry';
  
  openFuelAddModal();
  
  document.getElementById('f-vehicle').value = f.vehicle;
  document.getElementById('f-quantity').value = f.quantity;
  document.getElementById('f-cost').value = f.cost;
  document.getElementById('f-date').value = f.date;
  
  openModal('fuel-modal');
}

function deleteFuel(id) {
  if (confirm(`Delete fuel entry ${id}?`)) {
    db.fuel = db.fuel.filter(f => f.id !== id);
    if (window.deletedIds) {
      window.deletedIds.deletedFuelIds.push(id);
    }
    showToast('Fuel Entry Deleted', 'Fuel entry deleted.', 'danger');
    saveDatabase();
    renderFuelTable();
  }
}

// --- MAINTENANCE MANAGEMENT CRUD ---
function renderMaintenanceTable(searchQuery = '') {
  const tbody = document.getElementById('maint-table-body');
  tbody.innerHTML = '';
  
  const filtered = db.maintenance.filter(m => 
    m.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">No maintenance logs found.</td></tr>`;
    return;
  }
  
  filtered.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${m.id}</strong></td>
      <td><span class="badge badge-secondary">${m.vehicle}</span></td>
      <td>${m.serviceType}</td>
      <td>₹${m.cost}</td>
      <td>${m.prevDate}</td>
      <td>${m.nextDate}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editMaint('${m.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteMaint('${m.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openMaintAddModal() {
  document.getElementById('modal-maint-title').textContent = 'Log Maintenance Record';
  
  const vSelect = document.getElementById('m-vehicle');
  vSelect.innerHTML = '';
  db.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.number;
    opt.textContent = v.number;
    vSelect.appendChild(opt);
  });
  
  openModal('maint-modal');
}

function saveMaintForm(event) {
  event.preventDefault();
  const vehicle = document.getElementById('m-vehicle').value;
  const serviceType = document.getElementById('m-type').value.trim();
  const cost = parseFloat(document.getElementById('m-cost').value);
  const prevDate = document.getElementById('m-prev-date').value;
  const nextDate = document.getElementById('m-next-date').value;
  
  if (editTarget) {
    const index = db.maintenance.findIndex(m => m.id === editTarget);
    if (index !== -1) {
      db.maintenance[index] = { id: editTarget, vehicle, serviceType, cost, prevDate, nextDate };
      showToast('Maintenance Updated', `Log ${editTarget} updated.`, 'success');
    }
  } else {
    const finalId = "MNT" + String(db.maintenance.length + 1).padStart(3, '0');
    db.maintenance.push({ id: finalId, vehicle, serviceType, cost, prevDate, nextDate });
    showToast('Maintenance Added', 'Service record stored.', 'success');
  }
  
  saveDatabase();
  closeModal('maint-modal');
  renderMaintenanceTable();
}

function editMaint(id) {
  const m = db.maintenance.find(item => item.id === id);
  if (!m) return;
  
  editTarget = id;
  document.getElementById('modal-maint-title').textContent = 'Edit Maintenance Log';
  
  openMaintAddModal();
  
  document.getElementById('m-vehicle').value = m.vehicle;
  document.getElementById('m-type').value = m.serviceType;
  document.getElementById('m-cost').value = m.cost;
  document.getElementById('m-prev-date').value = m.prevDate;
  document.getElementById('m-next-date').value = m.nextDate;
  
  openModal('maint-modal');
}

function deleteMaint(id) {
  if (confirm(`Remove maintenance log ${id}?`)) {
    db.maintenance = db.maintenance.filter(m => m.id !== id);
    if (window.deletedIds) {
      window.deletedIds.deletedMaintenanceIds.push(id);
    }
    showToast('Record Deleted', 'Maintenance log removed.', 'danger');
    saveDatabase();
    renderMaintenanceTable();
  }
}

// --- EMPLOYEE MANAGEMENT CRUD ---
function renderEmployeeTable(searchQuery = '') {
  const tbody = document.getElementById('employee-table-body');
  tbody.innerHTML = '';
  
  const filtered = db.employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No employees found.</td></tr>`;
    return;
  }
  
  filtered.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${e.id}</strong></td>
      <td>${e.name}</td>
      <td>${e.email}</td>
      <td>${e.phone}</td>
      <td><span class="badge badge-info">${e.role}</span></td>
      <td>${e.joinDate}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" onclick="editEmployee('${e.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn-icon delete" onclick="deleteEmployee('${e.id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveEmployeeForm(event) {
  event.preventDefault();
  const empIdVal = document.getElementById('emp-id').value.trim();
  const name = document.getElementById('emp-name').value.trim();
  const email = document.getElementById('emp-email').value.trim();
  const phone = document.getElementById('emp-phone').value.trim();
  const role = document.getElementById('emp-role').value;
  const joinDate = document.getElementById('emp-joindate').value;
  
  if (editTarget) {
    const index = db.employees.findIndex(e => e.id === editTarget);
    if (index !== -1) {
      db.employees[index] = { id: editTarget, name, email, phone, role, joinDate };
      showToast('Employee Updated', `Employee ${name} details modified.`, 'success');
    }
  } else {
    const finalId = empIdVal || "EMP" + String(db.employees.length + 1).padStart(3, '0');
    if (db.employees.some(e => e.id === finalId)) {
      showToast('Error', 'Employee ID already exists.', 'danger');
      return;
    }
    db.employees.push({ id: finalId, name, email, phone, role, joinDate });
    showToast('Employee Added', `Employee ${name} registered.`, 'success');
  }
  
  saveDatabase();
  closeModal('employee-modal');
  renderEmployeeTable();
}

function editEmployee(id) {
  const e = db.employees.find(item => item.id === id);
  if (!e) return;
  
  editTarget = id;
  document.getElementById('modal-employee-title').textContent = 'Update Employee Info';
  
  document.getElementById('emp-id').value = e.id;
  document.getElementById('emp-id').disabled = true;
  document.getElementById('emp-name').value = e.name;
  document.getElementById('emp-email').value = e.email;
  document.getElementById('emp-phone').value = e.phone;
  document.getElementById('emp-role').value = e.role;
  document.getElementById('emp-joindate').value = e.joinDate;
  
  openModal('employee-modal');
}

function deleteEmployee(id) {
  if (id === 'EMP001') {
    showToast('Action Denied', 'Main administrator account cannot be deleted.', 'warning');
    return;
  }
  if (confirm(`Delete employee ${id}?`)) {
    db.employees = db.employees.filter(e => e.id !== id);
    if (window.deletedIds) {
      window.deletedIds.deletedEmployeeIds.push(id);
    }
    showToast('Employee Deleted', 'Record deleted successfully.', 'danger');
    saveDatabase();
    renderEmployeeTable();
  }
}

// ==========================================================================
// EMERGENCY INCIDENT CENTER (NEW DETAILED DISPATCH PAGE)
// ==========================================================================
function renderEmergencyAlerts() {
  const container = document.getElementById('emergency-alerts-list-container');
  if (!container) return;
  container.innerHTML = '';
  
  // Sort: Pending breakdowns first, then Resolved
  const sortedBreakdowns = [...db.breakdowns].sort((a,b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return new Date(b.date) - new Date(a.date);
  });
  
  if (sortedBreakdowns.length === 0) {
    container.innerHTML = '<div class="text-center text-muted py-5 w-full">No emergency breakdowns logged. All clear!</div>';
    return;
  }
  
  const isMechanic = loggedInUser && loggedInUser.role === 'MECHANIC';
  
  sortedBreakdowns.forEach(bd => {
    // Look up matching driver and vehicle details robustly
    const vehicle = findVehicleByNumberOrId(bd.vehicle);
    
    // Look up driver by name/id matching bd.driverId or vehicle pairing
    let driver = null;
    if (bd.driverId) {
      driver = db.drivers.find(d => d.id === bd.driverId);
    }
    if (!driver && vehicle) {
      driver = db.drivers.find(d => d.assignedVehicle === vehicle.number || d.assignedVehicle === vehicle.id);
    }
    if (!driver) {
      driver = db.drivers.find(d => d.assignedVehicle === bd.vehicle);
    }
    
    const card = document.createElement('div');
    const isPending = bd.status === 'Pending';
    card.className = `emergency-alert-card ${!isPending ? 'resolved' : ''}`;
    
    let cardHeaderHTML = '';
    let cardBodyHTML = '';
    let btnHTML = '';
    
    if (isMechanic) {
      // Mechanic Role Header
      cardHeaderHTML = `
        <div class="emergency-card-header">
          <div class="emergency-card-title">
            <h3>Emergency Incident Case</h3>
            <p>Logged Date: ${bd.date || SYSTEM_DATE}</p>
          </div>
          <span class="badge ${isPending ? 'badge-danger animate-pulse' : 'badge-success'}">${bd.status}</span>
        </div>
      `;
      
      // Mechanic Role Body: ONLY location and driver details
      cardBodyHTML = `
        <div class="emergency-card-body">
          <table class="report-table" style="margin-top: 0;">
            <tr><th>Incident Location</th><td><strong class="text-danger"><i class="fas fa-map-marker-alt"></i> ${bd.location}</strong></td></tr>
            <tr><th>Driver Name</th><td>${driver ? driver.name : (bd.driverName || 'Unknown Driver')}</td></tr>
            <tr><th>Driver Contact</th><td><a href="tel:${driver ? driver.phone : ''}">${driver ? driver.phone : 'N/A'}</a></td></tr>
          </table>
          ${bd.rangeWarning ? `<div class="mt-2 text-danger" style="font-size: 0.8rem; font-weight:700;"><i class="fas fa-exclamation-circle"></i> Out of Range Warning: Driver advised to visit nearby shop.</div>` : ''}
        </div>
      `;
      
      // Mechanic Actions
      if (bd.mechanicStatus === 'Completed') {
        btnHTML = `<span class="badge badge-warning" style="padding: 6px 12px;"><i class="fas fa-clock"></i> Maintenance Completed Message Sent</span>`;
      } else if (isPending) {
        btnHTML = `<button class="btn btn-warning btn-sm" onclick="mechanicCompleteMaintenance('${bd.id}')"><i class="fas fa-tools"></i> Send Maintenance Completed Update</button>`;
      } else {
        btnHTML = `<span class="badge badge-success" style="padding: 6px 12px;"><i class="fas fa-check-double"></i> Ticket Closed</span>`;
      }
      
    } else {
      // Admin/Employee Role Header
      cardHeaderHTML = `
        <div class="emergency-card-header">
          <div class="emergency-card-title">
            <h3>Vehicle: <span class="badge badge-secondary" style="font-size: 1rem;">${vehicle ? vehicle.number : bd.vehicle}</span></h3>
            <p>Issue Date: ${bd.date || SYSTEM_DATE}</p>
          </div>
          <span class="badge ${isPending ? 'badge-danger animate-pulse' : 'badge-success'}">${bd.status}</span>
        </div>
      `;
      
      // Admin/Employee Role Body: Full Details
      cardBodyHTML = `
        <div class="emergency-card-body">
          <table class="report-table" style="margin-top: 0;">
            <tr><th>Incident Location</th><td><strong class="text-danger"><i class="fas fa-map-marker-alt"></i> ${bd.location}</strong></td></tr>
            <tr><th>Problem Type</th><td><span class="badge badge-danger">${bd.issueType}</span></td></tr>
            <tr><th>Driver Assigned</th><td>${driver ? `${driver.name} (ID: ${driver.id})` : (bd.driverName || 'Unassigned')}</td></tr>
            <tr><th>Driver Contact</th><td><a href="tel:${driver ? driver.phone : ''}">${driver ? driver.phone : 'N/A'}</a></td></tr>
            <tr><th>Vehicle Specifications</th><td>${vehicle ? `${vehicle.type} (ID: ${vehicle.id})` : 'N/A'}</td></tr>
            ${bd.distance ? `<tr><th>Distance from Depot</th><td>${bd.distance} KM ${bd.rangeWarning ? '<span class="text-danger" style="font-weight:700;">(Out of Range > 60KM)</span>' : '(Within Range)'}</td></tr>` : ''}
          </table>
          
          <div class="emergency-card-description">
            <strong>Incident Description:</strong><br>
            ${bd.description}
          </div>
          
          ${bd.photo ? `<div class="mt-2 text-muted" style="font-size: 0.8rem;"><i class="fas fa-camera"></i> Attached photo: ${bd.photo}</div>` : ''}
        </div>
      `;
      
      // Admin Actions
      if (isPending) {
        const mechMsgHTML = bd.mechanicStatus === 'Completed' 
          ? `<div class="mb-2 text-warning" style="font-size: 0.85rem;"><i class="fas fa-comment-dots"></i> <strong>Mechanic Update:</strong> Maintenance is completed. Ready to resolve.</div>` 
          : bd.mechanicStatus === 'Dispatched' 
          ? `<div class="mb-2 text-info" style="font-size: 0.85rem;"><i class="fas fa-truck-pickup"></i> Mechanic Rajesh Dispatched. Awaiting complete message.</div>`
          : '';
        
        btnHTML = `
          ${mechMsgHTML}
          <button class="btn btn-danger btn-sm" onclick="dispatchMechanic('${bd.id}')" ${bd.mechanicStatus === 'Dispatched' || bd.mechanicStatus === 'Completed' ? 'disabled' : ''}><i class="fas fa-truck-pickup"></i> Dispatch Mechanic</button>
          <button class="btn btn-success btn-sm" onclick="resolveEmergencyBreakdown('${bd.id}')"><i class="fas fa-check"></i> Mark Resolved / Close Ticket</button>
        `;
      } else {
        btnHTML = `<span class="badge badge-success" style="padding: 6px 12px;"><i class="fas fa-check-double"></i> Incident Resolved</span>`;
      }
    }
    
    card.innerHTML = cardHeaderHTML + cardBodyHTML + `<div class="emergency-card-actions">${btnHTML}</div>`;
    container.appendChild(card);
  });
}

function dispatchMechanic(id) {
  const bdIndex = db.breakdowns.findIndex(b => b.id === id);
  if (bdIndex === -1) return;
  
  const bd = db.breakdowns[bdIndex];
  bd.mechanicStatus = 'Dispatched';
  
  // Send SMS immediately to Rajesh Mechanic (EMP004)
  db.alerts.unshift({
    id: "ALT" + String(db.alerts.length + 1).padStart(3, '0'),
    vehicle: bd.vehicle,
    title: `SMS DISPATCH to Rajesh Mechanic (EMP004): Emergency Breakdown for vehicle ${bd.vehicle} at ${bd.location}`,
    type: 'info',
    date: SYSTEM_DATE
  });
  
  saveDatabase();
  showToast('Mechanic Dispatched', `SMS immediately sent to Mechanic Rajesh (9876543220): Emergency breakdown at ${bd.location}.`, 'success');
  renderEmergencyAlerts();
  renderNotificationsList();
}

function mechanicCompleteMaintenance(id) {
  const bdIndex = db.breakdowns.findIndex(b => b.id === id);
  if (bdIndex === -1) return;
  
  const bd = db.breakdowns[bdIndex];
  bd.mechanicStatus = 'Completed';
  
  // Push SMS update to admin
  db.alerts.unshift({
    id: "ALT" + String(db.alerts.length + 1).padStart(3, '0'),
    vehicle: bd.vehicle,
    title: `SMS UPDATE: Mechanic Rajesh completed maintenance for vehicle ${bd.vehicle}`,
    type: 'warning',
    date: SYSTEM_DATE
  });
  
  saveDatabase();
  showToast('Update Sent to Admin', 'Message sent to admin: Maintenance is completed.', 'success');
  renderEmergencyAlerts();
  renderNotificationsList();
}

function resolveEmergencyBreakdown(id) {
  const bdIndex = db.breakdowns.findIndex(b => b.id === id);
  if (bdIndex === -1) return;
  
  const bd = db.breakdowns[bdIndex];
  bd.status = 'Resolved';
  bd.mechanicStatus = 'Completed';
  
  // Set vehicle status back to active
  const vIndex = db.vehicles.findIndex(v => v.number === bd.vehicle || v.id === bd.vehicle);
  if (vIndex !== -1) {
    db.vehicles[vIndex].status = 'Active';
  }
  
  // Remove emergency breakdown alert from alerts array
  db.alerts = db.alerts.filter(alt => !(alt.vehicle === bd.vehicle && alt.title.toLowerCase().includes('breakdown')));
  
  saveDatabase();
  showToast('Incident Resolved', `Incident for vehicle ${bd.vehicle} has been closed. Vehicle status is reset to Active.`, 'success');
  
  renderEmergencyAlerts();
  renderNotificationsList();
}

// ==========================================================================
// ADMIN ROUTE OPTIMIZATION SIMULATOR (NEW)
// ==========================================================================
function calculateAdminOptimalRoute() {
  const source = document.getElementById('admin-route-source').value.trim().toLowerCase();
  const dest = document.getElementById('admin-route-destination').value.trim().toLowerCase();
  const resultBox = document.getElementById('admin-route-result');
  
  if (!resultBox) return;

  resultBox.classList.remove('d-none');

  let distance = "135 KM";
  let time = "2 Hours 45 Mins";
  let fuel = "₹850";
  let path = "NH716 Route (via Puttur Bypass)";
  let savings = "₹180 Saved";

  if (source.includes("tirupati") && dest.includes("chennai")) {
    distance = "135 KM";
    time = "2 Hours 45 Mins";
    fuel = "₹850";
    path = "NH716 Route (via Puttur Bypass)";
    savings = "₹180 Saved";
  } else if (source.includes("hyderabad") && dest.includes("vijayawada")) {
    distance = "275 KM";
    time = "5 Hours 10 Mins";
    fuel = "₹1,850";
    path = "NH65 Expressway (via Suryapet)";
    savings = "₹350 Saved";
  } else if (source.includes("bangalore") && dest.includes("chennai")) {
    distance = "350 KM";
    time = "6 Hours 30 Mins";
    fuel = "₹2,400";
    path = "NH48 Expressway (via Hosur & Vellore)";
    savings = "₹420 Saved";
  } else {
    const distNum = Math.floor(Math.random() * 400) + 50;
    distance = `${distNum} KM`;
    const mins = distNum * 1.2;
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    time = `${h} Hours ${m} Mins`;
    fuel = `₹${Math.floor(distNum * 6.5)}`;
    path = `AI Route Sector-${Math.floor(Math.random() * 10) + 1} Bypass`;
    savings = `₹${Math.floor(distNum * 1.2)} Saved`;
  }

  document.getElementById('admin-res-route-path').textContent = path;
  document.getElementById('admin-res-route-dist').textContent = distance;
  document.getElementById('admin-res-route-time').textContent = time;
  document.getElementById('admin-res-route-fuel').textContent = fuel;
  
  const savingsSpan = resultBox.querySelector('.route-result-grid div:last-child span');
  if (savingsSpan) {
    savingsSpan.innerHTML = `<i class="fas fa-check-circle"></i> ${savings}`;
  }
  
  showToast('Route Optimized', `Optimal dispatch path calculated for ${source.toUpperCase()} ➔ ${dest.toUpperCase()}.`, 'success');
}

// ==========================================================================
// MECHANIC CONSOLE CONTROLLER (NEW)
// ==========================================================================
function renderMechanicDashboard() {
  const assignedTbody = document.getElementById('mechanic-assigned-table-body');
  const pendingTbody = document.getElementById('mechanic-pending-table-body');
  const historyTbody = document.getElementById('mechanic-history-table-body');
  
  if (!assignedTbody || !pendingTbody || !historyTbody) return;
  
  assignedTbody.innerHTML = '';
  pendingTbody.innerHTML = '';
  historyTbody.innerHTML = '';

  let activeCount = 0;
  let pendingCount = 0;
  let completedCount = 0;
  let totalBilling = 0;

  // Ensure db.repairs exists
  if (!db.repairs) {
    db.repairs = [];
  }

  // 1. Process Regular Repairs (db.repairs)
  db.repairs.forEach(rep => {
    if (rep.status === 'Assigned') {
      activeCount++;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><strong>${rep.id}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-secondary">${rep.vehicle}</span></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${rep.description}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">₹${rep.cost.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${rep.date || SYSTEM_DATE}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-warning">Assigned</span></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
          <button class="btn btn-success btn-sm" onclick="completeRegularRepair('${rep.id}')" style="padding: 4px 8px; font-size: 0.75rem; border: none; cursor: pointer; border-radius: 4px;"><i class="fas fa-check"></i> Complete</button>
        </td>
      `;
      assignedTbody.appendChild(tr);
    } else if (rep.status === 'Pending') {
      pendingCount++;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><strong>${rep.id}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-secondary">${rep.vehicle}</span></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${rep.description}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${rep.date || SYSTEM_DATE}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
          <button class="btn btn-primary btn-sm" onclick="claimRegularRepair('${rep.id}')" style="padding: 4px 8px; font-size: 0.75rem; border: none; cursor: pointer; border-radius: 4px; color: #fff; background-color: var(--primary);"><i class="fas fa-wrench"></i> Claim Job</button>
        </td>
      `;
      pendingTbody.appendChild(tr);
    } else if (rep.status === 'Completed') {
      completedCount++;
      totalBilling += rep.cost;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><strong>${rep.id}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-secondary">${rep.vehicle}</span></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${rep.description}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">₹${rep.cost.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${rep.date || SYSTEM_DATE}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-success">Completed</span></td>
      `;
      historyTbody.appendChild(tr);
    }
  });

  // 2. Process Emergency Breakdowns (db.breakdowns)
  db.breakdowns.forEach(bd => {
    const driver = db.drivers.find(d => d.assignedVehicle === bd.vehicle) || { name: "Ramesh", phone: "9123456789" };
    
    if (bd.status === 'Pending') {
      if (bd.mechanicStatus === 'Dispatched') {
        activeCount++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><strong class="text-danger">${bd.id} (Emergency)</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-secondary">${bd.vehicle}</span></td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
            <div><strong>Location:</strong> ${bd.location}</div>
            <div style="font-size: 0.8rem; color:var(--text-muted); margin-top: 3px;">
              Driver: ${driver.name} | <a href="tel:${driver.phone}"><i class="fas fa-phone"></i> ${driver.phone}</a>
            </div>
            <div style="font-size: 0.8rem; font-style: italic; margin-top:3px;">"${bd.description}"</div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">-</td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${bd.date}</td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-danger">Dispatched</span></td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
            <button class="btn btn-warning btn-sm" onclick="completeEmergencyRepair('${bd.id}')" style="padding: 4px 8px; font-size: 0.75rem; border: none; cursor: pointer; border-radius: 4px; color: #fff; background-color: var(--warning);"><i class="fas fa-check"></i> Send Done Alert</button>
          </td>
        `;
        assignedTbody.appendChild(tr);
      } else if (bd.mechanicStatus === 'Pending') {
        pendingCount++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><strong class="text-danger">${bd.id} (Emergency)</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-secondary">${bd.vehicle}</span></td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
            <strong>${bd.issueType}</strong> at ${bd.location}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${bd.date}</td>
          <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">
            <button class="btn btn-danger btn-sm" onclick="claimEmergencyRepair('${bd.id}')" style="padding: 4px 8px; font-size: 0.75rem; border: none; cursor: pointer; border-radius: 4px; color: #fff; background-color: var(--danger);"><i class="fas fa-truck-pickup"></i> Claim & Dispatch</button>
          </td>
        `;
        pendingTbody.appendChild(tr);
      }
    } else if (bd.status === 'Resolved' || bd.mechanicStatus === 'Completed') {
      completedCount++;
      const cost = bd.rangeWarning ? 0 : 5000;
      totalBilling += cost;
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><strong>${bd.id}</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-secondary">${bd.vehicle}</span></td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">Emergency breakdown assistance (${bd.issueType})</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">₹${cost.toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);">${bd.date}</td>
        <td style="padding: 10px; border-bottom: 1px solid var(--border-color);"><span class="badge badge-success">Resolved</span></td>
      `;
      historyTbody.appendChild(tr);
    }
  });

  // Update stats
  document.getElementById('mech-stat-assigned').textContent = activeCount;
  document.getElementById('mech-stat-pending').textContent = pendingCount;
  document.getElementById('mech-stat-completed').textContent = completedCount;
  document.getElementById('mechanic-total-billing').textContent = `₹${totalBilling.toLocaleString()}`;

  // If table bodies are empty, print fallback rows
  if (assignedTbody.children.length === 0) {
    assignedTbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 15px;">No active repair jobs assigned. Good job!</td></tr>';
  }
  if (pendingTbody.children.length === 0) {
    pendingTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 15px;">No pending maintenance requests reported.</td></tr>';
  }
  if (historyTbody.children.length === 0) {
    historyTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 15px;">No completed repairs logged in history.</td></tr>';
  }
}

function claimRegularRepair(id) {
  const rep = db.repairs.find(r => r.id === id);
  if (rep) {
    rep.status = 'Assigned';
    saveDatabase();
    showToast('Job Claimed', `You have claimed repair job ${id} for vehicle ${rep.vehicle}.`, 'success');
    renderMechanicDashboard();
  }
}

function completeRegularRepair(id) {
  const rep = db.repairs.find(r => r.id === id);
  if (rep) {
    const costInput = prompt(`Enter actual repair billing cost for job ${id}:`, rep.cost);
    if (costInput === null) return;
    const finalCost = parseFloat(costInput) || rep.cost;
    
    rep.status = 'Completed';
    rep.cost = finalCost;
    rep.date = SYSTEM_DATE;

    const vIndex = db.vehicles.findIndex(v => v.number === rep.vehicle || v.id === rep.vehicle);
    if (vIndex !== -1) {
      db.vehicles[vIndex].status = 'Active';
    }

    saveDatabase();
    showToast('Repair Completed', `Job ${id} has been marked complete. Vehicle ${rep.vehicle} is operational.`, 'success');
    renderMechanicDashboard();
  }
}

function claimEmergencyRepair(id) {
  dispatchMechanic(id);
  renderMechanicDashboard();
}

// Action helper functions for emergency repairs
function completeEmergencyRepair(id) {
  mechanicCompleteMaintenance(id);
  renderMechanicDashboard();
}

// ==========================================================================
// GLOBAL SEARCH MODULE
// ==========================================================================
function initGlobalSearch() {
  const select = document.getElementById('search-vehicle-select');
  select.innerHTML = '<option value="">-- Choose a Vehicle --</option>';
  db.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.number;
    opt.textContent = v.number;
    select.appendChild(opt);
  });
  
  document.getElementById('global-search-results').classList.add('d-none');
}

function executeGlobalSearch() {
  const selectVal = document.getElementById('search-vehicle-select').value;
  const inputVal = document.getElementById('global-search-input').value;
  const query = inputVal || selectVal;
                
  if (!query) {
    showToast('Blank Search', 'Please select or type a vehicle number or ID.', 'warning');
    return;
  }
  
  // Find vehicle by number or ID
  const vehicle = findVehicleByNumberOrId(query);
  if (!vehicle) {
    showToast('Not Found', `Vehicle ${query} does not exist in databases.`, 'danger');
    document.getElementById('global-search-results').classList.add('d-none');
    return;
  }
  
  // Find driver
  const driver = db.drivers.find(d => d.assignedVehicle === vehicle.number);
  
  // Calculate distance travelled
  const vehicleTrips = db.trips.filter(t => t.vehicle === vehicle.number);
  const totalDistance = vehicleTrips.reduce((acc, t) => acc + t.distance, 0);
  
  // Last Fuel filled
  const fuelEntries = db.fuel.filter(f => f.vehicle === vehicle.number).sort((a,b) => new Date(b.date) - new Date(a.date));
  const lastFuelDate = fuelEntries.length > 0 ? fuelEntries[0].date : 'N/A';
  
  // Service info
  const maintEntries = db.maintenance.filter(m => m.vehicle === vehicle.number).sort((a,b) => new Date(b.nextDate) - new Date(a.nextDate));
  const prevServiceDate = maintEntries.length > 0 ? maintEntries[0].prevDate : 'N/A';
  const nextServiceDate = maintEntries.length > 0 ? maintEntries[0].nextDate : 'N/A';
  
  // Update DOM
  document.getElementById('gs-v-number').textContent = vehicle.number;
  document.getElementById('gs-v-type').textContent = vehicle.type;
  document.getElementById('gs-v-status').innerHTML = `<span class="badge ${vehicle.status === 'Active' ? 'badge-success' : 'badge-warning'}">${vehicle.status}</span>`;
  document.getElementById('gs-v-insurance').textContent = vehicle.insuranceExpiry;
  
  document.getElementById('gs-d-name').textContent = driver ? driver.name : 'Unassigned';
  document.getElementById('gs-d-phone').textContent = driver ? driver.phone : 'N/A';
  document.getElementById('gs-d-license').textContent = driver ? driver.licenseNumber : 'N/A';
  document.getElementById('gs-d-expiry').textContent = driver ? driver.licenseExpiry : 'N/A';
  
  document.getElementById('gs-stat-distance').textContent = `${totalDistance} KM`;
  document.getElementById('gs-stat-fuel').textContent = lastFuelDate;
  document.getElementById('gs-stat-prevservice').textContent = prevServiceDate;
  document.getElementById('gs-stat-nextservice').textContent = nextServiceDate;
  
  document.getElementById('global-search-results').classList.remove('d-none');
  showToast('Search Completed', `Data found for vehicle ${vehicle.number}`, 'success');
}

// ==========================================================================
// AI PREDICTION MODULE
// ==========================================================================
function initAIPredictions() {
  document.getElementById('ai-prediction-results').classList.add('d-none');
  document.getElementById('ai-vehicle-search-input').value = '';
}

function calculateAIPredictions() {
  const query = document.getElementById('ai-vehicle-search-input').value;
  if (!query) {
    showToast('Search Input Required', 'Please enter a vehicle number or ID.', 'warning');
    return;
  }
  
  const vehicle = findVehicleByNumberOrId(query);
  if (!vehicle) {
    showToast('Not Found', `Vehicle ${query} does not exist in databases.`, 'danger');
    document.getElementById('ai-prediction-results').classList.add('d-none');
    return;
  }
  
  const vNum = vehicle.number;
  const driver = db.drivers.find(d => d.assignedVehicle === vNum);
  const maintLogs = db.maintenance.filter(m => m.vehicle === vNum);
  const fuelLogs = db.fuel.filter(f => f.vehicle === vNum);
  const totalTrips = db.trips.filter(t => t.vehicle === vNum).length;
  
  // 1. Predictive Maintenance
  let maintenanceRequired = "No";
  let riskLevel = "Low";
  let predNextService = "2026-09-15";
  
  if (vehicle.status === 'Under Maintenance') {
    maintenanceRequired = "In Progress";
    riskLevel = "N/A";
    predNextService = "Immediate";
  } else if (maintLogs.length > 0) {
    const latest = maintLogs.sort((a,b) => new Date(b.nextDate) - new Date(a.nextDate))[0];
    const diffTime = new Date(latest.nextDate) - new Date(SYSTEM_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) {
      maintenanceRequired = "Yes (Overdue)";
      riskLevel = "Critical";
      predNextService = latest.nextDate;
    } else if (diffDays <= 15) {
      maintenanceRequired = "Yes (Upcoming)";
      riskLevel = "Medium";
      predNextService = latest.nextDate;
    } else {
      maintenanceRequired = "No";
      riskLevel = "Low";
      predNextService = latest.nextDate;
    }
  }
  
  // 2. Vehicle Health Score
  let healthScore = 88;
  if (vehicle.status === 'Under Maintenance') healthScore = 45;
  else if (maintLogs.some(m => new Date(m.nextDate) < new Date(SYSTEM_DATE))) healthScore = 65; // overdue
  
  let rating = "Good";
  if (healthScore >= 90) rating = "Excellent";
  else if (healthScore >= 75) rating = "Good";
  else if (healthScore >= 55) rating = "Average";
  else rating = "Poor";
  
  // 3. Fuel Cost Prediction
  let avgCostPerFuel = fuelLogs.reduce((acc, f) => acc + f.cost, 0) / (fuelLogs.length || 1);
  if (avgCostPerFuel === 0) avgCostPerFuel = 7500;
  const expectedCostNextMonth = Math.round(avgCostPerFuel * 1.12);
  const fuelTrend = (fuelLogs.length > 1 && fuelLogs[0].quantity > fuelLogs[1].quantity) ? "Increasing" : "Stable";
  
  // 4. Driver Performance
  let driverRating = 4.5;
  let driverEfficiency = "Good";
  if (driver) {
    if (driver.name === 'Ramesh') { driverRating = 4.8; driverEfficiency = "Excellent"; }
    else if (driver.name === 'Suresh') { driverRating = 3.9; driverEfficiency = "Average"; }
    else { driverRating = 4.2; driverEfficiency = "Good"; }
  }
  
  // 5. Fuel Efficiency
  let kmPerLiter = 8.5; // defaults
  if (vehicle.type === 'Truck') kmPerLiter = 5.2;
  else if (vehicle.type === 'Van') kmPerLiter = 8.4;
  else kmPerLiter = 14.5;
  
  let efficiencyCategory = "High Efficiency";
  if (kmPerLiter < 6.0) efficiencyCategory = "Heavy Consumer (Standard)";
  else if (kmPerLiter < 10.0) efficiencyCategory = "Moderate Efficiency";
  
  // 6. Breakdown Risk
  let breakdownProbability = 8; // %
  let breakdownRisk = "Low";
  let recommendedAction = "Continue operations, schedule standard oil change.";
  
  if (healthScore < 60) {
    breakdownProbability = 68;
    breakdownRisk = "High";
    recommendedAction = "Immediate inspection of engine heating and brake wear required.";
  } else if (healthScore < 80) {
    breakdownProbability = 32;
    breakdownRisk = "Medium";
    recommendedAction = "Check spark plugs and alignment at next stop.";
  }
  
  // Update AI UI
  document.getElementById('ai-pred-maint-req').textContent = maintenanceRequired;
  document.getElementById('ai-pred-maint-risk').textContent = riskLevel;
  document.getElementById('ai-pred-maint-date').textContent = predNextService;
  
  // Toggle and populate Recommended Service Center details
  const recBox = document.getElementById('ai-pred-maint-rec-box');
  if (recBox) {
    if (maintenanceRequired.startsWith("Yes")) {
      recBox.classList.remove('d-none');
      document.getElementById('ai-pred-maint-center').textContent = "Madhapur Fleet Diagnostics Point";
      document.getElementById('ai-pred-maint-dist').textContent = "8 KM";
      document.getElementById('ai-pred-maint-cost').textContent = "₹5,000";
      document.getElementById('ai-pred-maint-time').textContent = "2 Days";
    } else {
      recBox.classList.add('d-none');
    }
  }

  // Populate Cost Savings predictions dynamically
  const costTodayEl = document.getElementById('ai-pred-cost-today');
  const costDelayEl = document.getElementById('ai-pred-cost-delay');
  const costSavingsEl = document.getElementById('ai-pred-cost-savings');
  if (costTodayEl && costDelayEl && costSavingsEl) {
    costTodayEl.textContent = "₹5,000";
    costDelayEl.textContent = "₹18,000";
    costSavingsEl.textContent = "₹13,000";
  }

  // Health score
  document.getElementById('ai-pred-health-score').textContent = `${healthScore}/100`;
  document.getElementById('ai-pred-health-rating').textContent = rating;
  document.getElementById('ai-pred-health-bar').style.width = `${healthScore}%`;
  
  // Fuel Cost
  document.getElementById('ai-pred-fuel-cost').textContent = `₹${expectedCostNextMonth.toLocaleString()}`;
  document.getElementById('ai-pred-fuel-trend').textContent = fuelTrend;
  
  // Driver Analysis
  document.getElementById('ai-pred-driver-rating').innerHTML = `<span class="text-warning">${'★'.repeat(Math.round(driverRating))}</span> (${driverRating})`;
  document.getElementById('ai-pred-driver-trips').textContent = totalTrips;
  document.getElementById('ai-pred-driver-eff').textContent = driverEfficiency;
  
  // Fuel Efficiency
  document.getElementById('ai-pred-efficiency-km').textContent = `${kmPerLiter} KM/L`;
  document.getElementById('ai-pred-efficiency-category').textContent = efficiencyCategory;
  
  // Breakdown Risk
  document.getElementById('ai-pred-breakdown-prob').textContent = `${breakdownProbability}%`;
  document.getElementById('ai-pred-breakdown-risk').textContent = breakdownRisk;
  document.getElementById('ai-pred-breakdown-action').textContent = recommendedAction;
  
  // Show UI
  document.getElementById('ai-prediction-results').classList.remove('d-none');
  showToast('AI Synthesis Complete', `ML predictions generated for ${vNum}`, 'info');
}

// ==========================================================================
// AI VEHICLE REPORT GENERATOR
// ==========================================================================
function initReportGenerator() {
  document.getElementById('report-preview-section').classList.add('d-none');
  document.getElementById('report-vehicle-search-input').value = '';
}

function generateVehicleReport() {
  const query = document.getElementById('report-vehicle-search-input').value;
  if (!query) {
    showToast('Search Input Required', 'Please enter a vehicle number or ID.', 'warning');
    return;
  }
  
  const vehicle = findVehicleByNumberOrId(query);
  if (!vehicle) {
    showToast('Not Found', `Vehicle ${query} does not exist in databases.`, 'danger');
    document.getElementById('report-preview-section').classList.add('d-none');
    return;
  }
  
  const vNum = vehicle.number;
  const driver = db.drivers.find(d => d.assignedVehicle === vNum);
  const trips = db.trips.filter(t => t.vehicle === vNum);
  const fuel = db.fuel.filter(f => f.vehicle === vNum);
  const maint = db.maintenance.filter(m => m.vehicle === vNum);
  
  // Mock AI Scores
  let healthScore = 90;
  let breakdownRisk = "Low (7%)";
  let predMaintCost = 12000;
  let predServiceDate = "2026-08-15";
  let maintRequired = "NO";
  
  if (vehicle.status === 'Under Maintenance') {
    healthScore = 50;
    breakdownRisk = "High (65%)";
    predMaintCost = 28000;
    predServiceDate = "Immediate";
    maintRequired = "YES";
  } else if (vehicle.number === "AP39AB1234" || vehicle.id === "101") {
    healthScore = 78;
    breakdownRisk = "Medium (48%)";
    predMaintCost = 5000;
    predServiceDate = "2026-06-25";
    maintRequired = "YES";
  } else if (maint.length > 0) {
    const latest = [...maint].sort((a,b) => new Date(b.nextDate) - new Date(a.nextDate))[0];
    predServiceDate = latest.nextDate;
  }
  
  // Aggregate stats
  const totalTrips = trips.length;
  const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
  const totalFuelCost = fuel.reduce((acc, f) => acc + f.cost, 0);
  const totalMaintCost = maint.reduce((acc, m) => acc + m.cost, 0);
  
  // Update report DOM
  document.getElementById('rep-date').textContent = SYSTEM_DATE;
  document.getElementById('rep-v-number').textContent = vehicle.number;
  document.getElementById('rep-v-type').textContent = vehicle.type;
  document.getElementById('rep-v-status').textContent = vehicle.status;
  document.getElementById('rep-v-insurance').textContent = vehicle.insuranceExpiry;
  
  document.getElementById('rep-d-name').textContent = driver ? driver.name : 'Unassigned';
  document.getElementById('rep-d-phone').textContent = driver ? driver.phone : 'N/A';
  
  document.getElementById('rep-trip-count').textContent = totalTrips;
  document.getElementById('rep-trip-distance').textContent = `${totalDistance} KM`;
  
  document.getElementById('rep-fuel-cost').textContent = `₹${totalFuelCost.toLocaleString()}`;
  document.getElementById('rep-maint-cost').textContent = `₹${totalMaintCost.toLocaleString()}`;
  
  document.getElementById('rep-health-score').textContent = `${healthScore}/100`;
  document.getElementById('rep-breakdown-risk').textContent = breakdownRisk;
  document.getElementById('rep-pred-cost').textContent = `₹${predMaintCost.toLocaleString()}`;
  document.getElementById('rep-pred-date').textContent = predServiceDate;
  document.getElementById('rep-ai-maint-required').textContent = maintRequired;

  // Toggle dynamic AI widgets
  const recSection = document.getElementById('rep-ai-rec-section');
  const savingsSection = document.getElementById('rep-ai-savings-section');

  if (maintRequired === "YES") {
    if (recSection) recSection.classList.remove('d-none');
    if (savingsSection) savingsSection.classList.remove('d-none');
    
    // cost values
    document.getElementById('rep-ai-cost-today').textContent = `₹${predMaintCost.toLocaleString()}`;
    const delayCost = predMaintCost === 5000 ? 18000 : 35000;
    document.getElementById('rep-ai-cost-delay').textContent = `₹${delayCost.toLocaleString()}`;
    document.getElementById('rep-ai-savings').textContent = `₹${(delayCost - predMaintCost).toLocaleString()}`;
  } else {
    if (recSection) recSection.classList.add('d-none');
    if (savingsSection) savingsSection.classList.add('d-none');
  }
  
  // Render tables inside report preview
  const tripTbody = document.getElementById('rep-trips-table');
  tripTbody.innerHTML = trips.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.source} to ${t.destination}</td>
      <td>${t.distance} KM</td>
    </tr>
  `).join('') || '<tr><td colspan="3" class="text-center">No recent trips.</td></tr>';
  
  const fuelTbody = document.getElementById('rep-fuel-table');
  fuelTbody.innerHTML = fuel.map(f => `
    <tr>
      <td>${f.date}</td>
      <td>${f.quantity} L</td>
      <td>₹${f.cost}</td>
    </tr>
  `).join('') || '<tr><td colspan="3" class="text-center">No fuel logs.</td></tr>';
  
  const maintTbody = document.getElementById('rep-maint-table');
  maintTbody.innerHTML = maint.map(m => `
    <tr>
      <td>${m.prevDate}</td>
      <td>${m.serviceType}</td>
      <td>₹${m.cost}</td>
    </tr>
  `).join('') || '<tr><td colspan="3" class="text-center">No maintenance history.</td></tr>';
  
  document.getElementById('report-preview-section').classList.remove('d-none');
  showToast('Report Compiled', `Fleet report created for ${vNum}`, 'success');
}

function downloadPDFReport() {
  showToast('PDF Engine Triggered', 'Compiling and downloading PDF structure...', 'success');
  window.print();
}

function printReport() {
  window.print();
}

// ==========================================================================
// ANALYTICS MODULE (CHART.JS INITIALIZATION)
// ==========================================================================
function initAnalyticsCharts() {
  Object.keys(activeCharts).forEach(key => {
    if (activeCharts[key]) activeCharts[key].destroy();
  });
  
  const ctxFuel = document.getElementById('chart-fuel-trend').getContext('2d');
  const ctxMaint = document.getElementById('chart-maint-trend').getContext('2d');
  const ctxTrips = document.getElementById('chart-trips-month').getContext('2d');
  const ctxStatus = document.getElementById('chart-vehicle-status').getContext('2d');
  const ctxDriver = document.getElementById('chart-driver-perf').getContext('2d');
  const ctxHealth = document.getElementById('chart-fleet-health').getContext('2d');
  const ctxUsage = document.getElementById('chart-vehicle-usage').getContext('2d');
  
  activeCharts.fuel = new Chart(ctxFuel, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Fuel Expenditure (₹)',
        data: [42000, 48000, 39000, 52000, 46000, 58000],
        borderColor: '#0f62fe',
        backgroundColor: 'rgba(15, 98, 254, 0.05)',
        tension: 0.3,
        fill: true
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
  
  activeCharts.maint = new Chart(ctxMaint, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Maintenance Cost (₹)',
        data: [15000, 22000, 8000, 34000, 19000, 25000],
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
  
  activeCharts.trips = new Chart(ctxTrips, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Trips Completed',
        data: [48, 55, 62, 59, 65, 72],
        backgroundColor: '#10b981',
        borderRadius: 4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
  
  const activeCount = db.vehicles.filter(v => v.status === 'Active').length;
  const maintCount = db.vehicles.filter(v => v.status === 'Under Maintenance').length;
  const inactiveCount = db.vehicles.filter(v => v.status === 'Inactive').length;
  
  activeCharts.status = new Chart(ctxStatus, {
    type: 'doughnut',
    data: {
      labels: ['Active', 'Maintenance', 'Inactive'],
      datasets: [{
        data: [activeCount, maintCount, inactiveCount],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
  
  activeCharts.driver = new Chart(ctxDriver, {
    type: 'bar',
    data: {
      labels: ['Ramesh', 'Mahesh', 'Naresh', 'Suresh'],
      datasets: [{
        label: 'Driver Safety & Efficiency Rating (Out of 5)',
        data: [4.8, 4.5, 4.2, 3.9],
        backgroundColor: '#8b5cf6',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  activeCharts.health = new Chart(ctxHealth, {
    type: 'polarArea',
    data: {
      labels: ['Engine Health', 'Tyre Condition', 'Brake Systems', 'Battery Capacity', 'Emissions'],
      datasets: [{
        data: [92, 85, 78, 88, 90],
        backgroundColor: [
          'rgba(15, 98, 254, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
  
  activeCharts.usage = new Chart(ctxUsage, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Fleet Utilization Rate (%)',
        data: [82, 88, 85, 91],
        borderColor: '#10b981',
        tension: 0.1,
        fill: false
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

// ==========================================================================
// DRIVER PORTAL LOGIC
// ==========================================================================
let currentDriverVehicle = 'AP39AB1234';

function initDriverPortal() {
  if (loggedInUser && loggedInUser.vehicle) {
    currentDriverVehicle = loggedInUser.vehicle;
  }
  
  document.getElementById('driver-welcome-text').textContent = `Welcome, Driver ${loggedInUser.name} 👤`;
  document.getElementById('driver-assigned-vehicle').textContent = currentDriverVehicle;
  
  // Populate Driver Vehicle Details
  const vehicle = db.vehicles.find(v => v.number === currentDriverVehicle);
  if (vehicle) {
    document.getElementById('drv-v-number').textContent = vehicle.number;
    document.getElementById('drv-v-type').textContent = vehicle.type;
    document.getElementById('drv-v-insurance').textContent = vehicle.insuranceExpiry;
    document.getElementById('drv-v-status').innerHTML = `<span class="badge ${vehicle.status === 'Active' ? 'badge-success' : 'badge-warning'}">${vehicle.status}</span>`;
  }
  
  // Populate Driver Trips
  const drvTrips = db.trips.filter(t => t.driver === loggedInUser.name || t.vehicle === currentDriverVehicle);
  const tripsTbody = document.getElementById('driver-trips-body');
  tripsTbody.innerHTML = drvTrips.map(t => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${t.source} to ${t.destination}</td>
      <td>${t.distance} KM</td>
      <td>${t.date}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" class="text-center">No assigned trips found.</td></tr>';
  
  // Health score (Mocked)
  let healthScore = 92;
  if (vehicle && vehicle.status === 'Under Maintenance') healthScore = 40;
  else if (currentDriverVehicle === "AP39AB1234") healthScore = 78;
  
  document.getElementById('drv-health-score').textContent = `${healthScore}/100`;
  document.getElementById('drv-health-rating').textContent = healthScore > 80 ? 'Excellent Condition' : 'Needs Check';
  document.getElementById('drv-health-progress').style.width = `${healthScore}%`;
  
  // Toggle service center recommendation inside the inline driver portal
  const inlineRecBox = document.getElementById('drv-maint-rec-box-inline');
  if (inlineRecBox) {
    if (healthScore < 80) {
      inlineRecBox.classList.remove('d-none');
    } else {
      inlineRecBox.classList.add('d-none');
    }
  }
  
  // Populate Breakdown Form default
  const bdVehicleInput = document.getElementById('bd-vehicle');
  if (bdVehicleInput) {
    if (currentDriverVehicle && currentDriverVehicle !== 'UNASSIGNED' && currentDriverVehicle.trim() !== '') {
      bdVehicleInput.value = currentDriverVehicle;
      bdVehicleInput.readOnly = true;
      bdVehicleInput.style.backgroundColor = '#f1f5f9';
    } else {
      bdVehicleInput.value = '';
      bdVehicleInput.readOnly = false;
      bdVehicleInput.style.backgroundColor = '#ffffff';
      bdVehicleInput.placeholder = "Enter Vehicle Number (e.g. AP39AB1234)";
    }
  }
}

function submitBreakdownReport(event) {
  event.preventDefault();
  const vehicle = document.getElementById('bd-vehicle').value.toUpperCase().trim();
  const location = document.getElementById('bd-location').value.trim();
  const distance = parseInt(document.getElementById('bd-distance').value) || 45;
  const issueType = document.getElementById('bd-issue').value;
  const description = document.getElementById('bd-description').value.trim();
  
  const fileInput = document.getElementById('bd-photo');
  let photoName = null;
  if (fileInput && fileInput.files.length > 0) {
    photoName = fileInput.files[0].name;
  }
  
  let rangeWarning = false;
  if (distance > 60) {
    rangeWarning = true;
    showToast('Range Exceeded', `Depot is ${distance} KM away. Coverage is 60 KM.`, 'warning');
    alert(`⚠️ Mechanic Coverage Range Exceeded (60 KM Max)\n\nThe nearest depot is ${distance} KM away. Please proceed or tow the vehicle to the nearest local mechanic shop.`);
  }

  const newId = "BD" + String(db.breakdowns.length + 1).padStart(3, '0');
  const report = {
    id: newId,
    vehicle,
    location,
    distance,
    rangeWarning,
    issueType,
    description,
    photo: photoName,
    date: SYSTEM_DATE,
    status: 'Pending',
    mechanicStatus: 'Pending',
    driverId: loggedInUser ? loggedInUser.id : null,
    driverName: loggedInUser ? loggedInUser.name : null
  };
  
  db.breakdowns.push(report);
  
  // Set vehicle status to maintenance
  const vIndex = db.vehicles.findIndex(v => v.number === vehicle || v.id === vehicle);
  if (vIndex !== -1) {
    db.vehicles[vIndex].status = 'Under Maintenance';
  }
  
  // Push an SMS alert notification
  db.alerts.unshift({
    id: "ALT" + String(db.alerts.length + 1).padStart(3, '0'),
    vehicle,
    title: `SMS WARNING: Emergency Breakdown (${issueType}) logged by Driver ${loggedInUser ? loggedInUser.name : 'Unknown'}. ${rangeWarning ? 'OUT OF RANGE (>60KM)' : ''}`,
    type: 'danger',
    date: SYSTEM_DATE
  });
  
  saveDatabase();
  showToast('Report Submitted', 'Emergency Breakdown report dispatched to fleet control center.', 'danger');
  
  // Reset form
  document.getElementById('breakdown-form').reset();
  
  // Reset vehicle value in form
  const bdVehicleInput = document.getElementById('bd-vehicle');
  if (bdVehicleInput) {
    bdVehicleInput.value = currentDriverVehicle;
  }
  
  // Sync
  initDriverPortal();
}

function saveSettings(event) {
  event.preventDefault();
  showToast('Settings Saved', 'System configurations updated globally.', 'success');
}

// ==========================================================================
// FLOATING AI ASSISTANT CHATBOT
// ==========================================================================
function toggleAIChatWindow() {
  const windowDiv = document.getElementById('ai-chat-window');
  windowDiv.classList.toggle('d-none');
  
  // Scroll to bottom
  if (!windowDiv.classList.contains('d-none')) {
    const container = document.getElementById('ai-chat-messages-container');
    container.scrollTop = container.scrollHeight;
  }
}

function handleAIChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('ai-chat-input-field');
  const query = input.value.trim();
  if (!query) return;
  
  // Append User message
  appendChatMessage(query, 'user');
  input.value = '';
  
  // Process Response
  setTimeout(() => {
    const reply = getAIResponse(query);
    appendChatMessage(reply, 'bot');
  }, 500);
}

function appendChatMessage(text, sender) {
  const container = document.getElementById('ai-chat-messages-container');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  msgDiv.innerHTML = `<div class="chat-bubble">${text}</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  
  // 1. GREETINGS
  if (m.includes('hello') || m.includes('hi') || m.includes('hey') || m.includes('assistant')) {
    return `Hello! How can I assist you with your fleet today? You can ask me questions about vehicle counts, driver phone numbers, emergency logs, or how to use the AI prediction model.`;
  }
  
  // 2. VEHICLES STATS
  if (m.includes('how many vehicles') || m.includes('vehicle count') || m.includes('total vehicle')) {
    const active = db.vehicles.filter(v => v.status==='Active').length;
    const maint = db.vehicles.filter(v => v.status==='Under Maintenance').length;
    return `We currently have <strong>${db.vehicles.length} vehicles</strong> registered in the fleet database. Active status: <strong>${active} operational</strong>, <strong>${maint} under maintenance</strong>.`;
  }

  // 3. DRIIVRS
  if (m.includes('driver') || m.includes('how many drivers')) {
    if (m.includes('ramesh')) {
      const drv = db.drivers.find(d => d.name === 'Ramesh');
      return `Driver <strong>Ramesh</strong> (ID: ${drv.id}) is assigned to vehicle <strong>${drv.assignedVehicle}</strong>. Phone: <strong>${drv.phone}</strong>. License Expiry: ${drv.licenseExpiry}.`;
    }
    return `There are <strong>${db.drivers.length} drivers</strong> registered. The main drivers are Ramesh, Suresh, Mahesh, and Naresh. You can check details in the "Driver Management" section.`;
  }
  
  // 4. SPECIFIC VEHICLE LOOKUP
  if (m.includes('vehicle status') || m.includes('ap39ab1234') || m.includes('101') || m.includes('102') || m.includes('ts09bc8899')) {
    let target = 'AP39AB1234';
    if (m.includes('101')) target = 'AP39AB1234';
    else if (m.includes('102') || m.includes('ts09bc8899')) target = 'TS09BC8899';
    else if (m.includes('103') || m.includes('ka51mb4567')) target = 'KA51MB4567';
    
    const vehicle = db.vehicles.find(v => v.number === target);
    const driver = db.drivers.find(d => d.assignedVehicle === target);
    
    return `Vehicle <strong>${target}</strong> (${vehicle.type}) status is <strong>${vehicle.status}</strong>. Driver assigned: <strong>${driver ? driver.name : 'None'}</strong>. Insurance expiry date: ${vehicle.insuranceExpiry}.`;
  }
  
  // 5. BREAKDOWN & EMERGENCY INFO
  if (m.includes('breakdown') || m.includes('emergency') || m.includes('accident') || m.includes('puncture')) {
    const pending = db.breakdowns.filter(b => b.status === 'Pending').length;
    return `There are currently <strong>${pending} pending emergency breakdown dispatches</strong>. You can manage them in the new <strong>Emergency Alerts</strong> panel. Driver incidents are logged with location, phone, and problem type.`;
  }
  
  // 6. HEALTH SCORE / AI PREDICTIONS
  if (m.includes('health') || m.includes('predict') || m.includes('risk') || m.includes('ai')) {
    return `Our AI diagnostic modules estimate breakdown probabilities, vehicle health scores, and next maintenance dates. Simply navigate to the <strong>AI Prediction</strong> sidebar view and search for a vehicle ID (like 101) to run a simulated model.`;
  }

  // 7. DEVELOPER PROJECT DETAILS
  if (m.includes('project') || m.includes('tech stack') || m.includes('aiml')) {
    return `This is the <strong>AI-Powered Fleet Management and Vehicle Health Monitoring System</strong> designed as an enterprise dashboard frontend project. It uses HTML5, CSS3, ES6+ Javascript, Chart.js for graphs, and localDB storage.`;
  }

  // 8. VEHICLES SERVICE STATUS
  if (m.includes('service') && (m.includes('need') || m.includes('due') || m.includes('schedule') || m.includes('which'))) {
    return `Based on our predictive models, vehicle <strong>AP39AB1234</strong> is due for service tomorrow (June 23rd). There are no other immediate services scheduled, but <strong>TS09BC8899</strong> is currently under maintenance.`;
  }

  // 9. HIGH-RISK VEHICLES LOOKUP
  if (m.includes('high risk') || m.includes('high-risk') || m.includes('risk level')) {
    return `Our AI breakdown risk analysis shows:
    <br>• <strong>TS09BC8899</strong>: High Risk (82%) - Suspension & Engine heating.
    <br>• <strong>MH12XY1122</strong>: Medium Risk (45%) - High fuel usage patterns.
    <br>• <strong>AP39AB1234</strong>: Low Risk (12%) - Healthy diagnostic history.`;
  }

  // 10. FUEL EXPENSES SUMMARY
  if (m.includes('fuel expense') || m.includes('fuel cost') || m.includes('spend on fuel')) {
    return `Total fleet fuel expenses stand at <strong>₹41,250</strong> across 5 logged purchases. The most expensive route is Bangalore ➔ Chennai, and vehicle <strong>AP39AB1234</strong> has the highest fuel spend (₹18,150 total across 2 fills).`;
  }
  
  // DEFAULT RESPONSE
  return `I recognize your request, but I don't have enough specific data. Try asking:
  - "How many vehicles are active?"
  - "Who is the driver of vehicle 101?"
  - "What is driver Ramesh's phone number?"
  - "Show me emergency breakdown counts."
  - "How does the AI health prediction work?"`;
}

// ==========================================================================
// LOCATION & GPS TRACKING MODULE
// ==========================================================================
const MOCK_GPS_DATA = {
  "AP39AB1234": {
    coords: "17.4485° N, 78.3908° E",
    lat: 17.4485,
    lng: 78.3908,
    spot: "Madhapur Metro Station Road, Hyderabad",
    speed: "65 KM/H",
    heading: "North-West",
    satellites: "Excellent (11 Satellites)",
    time: "2026-06-22 22:48:15",
    lastStopLocation: "Gachibowli Junction Bypass, Hyderabad",
    lastStopDuration: "Stopped for 15 minutes (20:15 - 20:30)",
    markerX: 65, // percentage from left
    markerY: 40,  // percentage from top
    stopX: 45,
    stopY: 55
  },
  "TS09BC8899": {
    coords: "17.4065° N, 78.4691° E",
    lat: 17.4065,
    lng: 78.4691,
    spot: "NH-44 Highway, Mile 142 near Medchal",
    speed: "0 KM/H",
    heading: "None (Stationary)",
    satellites: "Good (7 Satellites)",
    time: "2026-06-22 22:40:02",
    lastStopLocation: "Medchal Toll Plaza Parking",
    lastStopDuration: "Stopped for 2 hours (20:40 - Present)",
    markerX: 80,
    markerY: 25,
    stopX: 80,
    stopY: 25
  },
  "KA51MB4567": {
    coords: "12.9716° N, 77.5946° E",
    lat: 12.9716,
    lng: 77.5946,
    spot: "Electronic City Phase 1 Main Rd, Bangalore",
    speed: "42 KM/H",
    heading: "South",
    satellites: "Excellent (12 Satellites)",
    time: "2026-06-22 22:49:00",
    lastStopLocation: "Silk Board Flyover Junction, Bangalore",
    lastStopDuration: "Stopped for 8 minutes (21:55 - 22:03)",
    markerX: 30,
    markerY: 75,
    stopX: 35,
    stopY: 65
  },
  "MH12XY1122": {
    coords: "18.5204° N, 73.8567° E",
    lat: 18.5204,
    lng: 73.8567,
    spot: "Expressway Exit, Hinjewadi Phase 3, Pune",
    speed: "80 KM/H",
    heading: "West",
    satellites: "Excellent (10 Satellites)",
    time: "2026-06-22 22:50:12",
    lastStopLocation: "Lonavala Food Court Stop",
    lastStopDuration: "Stopped for 30 minutes (19:30 - 20:00)",
    markerX: 15,
    markerY: 35,
    stopX: 25,
    stopY: 45
  },
  "DL01AB9999": {
    coords: "28.6139° N, 77.2090° E",
    lat: 28.6139,
    lng: 77.2090,
    spot: "Connaught Place Radial Road 4, New Delhi",
    speed: "15 KM/H",
    heading: "East",
    satellites: "Excellent (9 Satellites)",
    time: "2026-06-22 22:45:00",
    lastStopLocation: "India Gate Circle Parking",
    lastStopDuration: "Stopped for 45 minutes (18:00 - 18:45)",
    markerX: 50,
    markerY: 20,
    stopX: 52,
    stopY: 22
  }
};

function getMockGPSData(vehicleNumber) {
  const cleanNum = vehicleNumber.trim().toUpperCase();
  if (MOCK_GPS_DATA[cleanNum]) {
    return MOCK_GPS_DATA[cleanNum];
  }
  
  // Dynamic fallback for any custom added vehicles
  // Generate random stable coordinates
  const lat = (17.3 + Math.random() * 0.2).toFixed(4);
  const lng = (78.3 + Math.random() * 0.2).toFixed(4);
  const headings = ["North", "South", "East", "West", "North-East", "South-West"];
  const heading = headings[Math.floor(Math.random() * headings.length)];
  const speedVal = Math.floor(Math.random() * 90);
  const speed = speedVal > 0 ? `${speedVal} KM/H` : "0 KM/H";
  
  // Deterministic random layout placement based on hash of number
  let hash = 0;
  for (let i = 0; i < cleanNum.length; i++) {
    hash = cleanNum.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.abs(hash % 60) + 20; // 20% to 80%
  const y = Math.abs((hash >> 3) % 60) + 20; // 20% to 80%
  const stopX = Math.abs((hash >> 6) % 60) + 20;
  const stopY = Math.abs((hash >> 9) % 60) + 20;

  return {
    coords: `${lat}° N, ${lng}° E`,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    spot: `Sector ${Math.abs(hash % 15) + 1} Logistics Bypass, Outer Ring Road`,
    speed: speed,
    heading: heading,
    satellites: "Excellent (8 Satellites)",
    time: "2026-06-22 22:51:00",
    lastStopLocation: `Route Rest House Depot ${Math.abs(hash % 5) + 1}`,
    lastStopDuration: `Stopped for ${Math.abs(hash % 45) + 10} minutes`,
    markerX: x,
    markerY: y,
    stopX: stopX,
    stopY: stopY
  };
}

function searchVehicleGPS() {
  const queryInput = document.getElementById('gps-vehicle-search-input');
  if (!queryInput) return;
  
  const query = queryInput.value.trim();
  if (!query) {
    showToast('Search Field Empty', 'Please enter a vehicle number or ID first.', 'warning');
    return;
  }
  
  const vehicle = findVehicleByNumberOrId(query);
  if (!vehicle) {
    showToast('Vehicle Not Found', `No active vehicle registered under "${query}".`, 'danger');
    // Hide results panel if showing
    document.getElementById('gps-tracking-results').classList.add('d-none');
    return;
  }
  
  const gpsData = getMockGPSData(vehicle.number);
  
  // Populate UI fields
  document.getElementById('gps-res-vehicle').textContent = vehicle.number;
  document.getElementById('gps-res-coords').textContent = gpsData.coords;
  document.getElementById('gps-res-spot').textContent = gpsData.spot;
  document.getElementById('gps-res-speed').textContent = gpsData.speed;
  document.getElementById('gps-res-heading').textContent = gpsData.heading;
  document.getElementById('gps-res-time').textContent = gpsData.time;
  document.getElementById('gps-res-last-stop-location').textContent = gpsData.lastStopLocation;
  document.getElementById('gps-res-last-stop-duration').textContent = gpsData.lastStopDuration;
  
  // Format Status Badge
  const statusBadge = document.getElementById('gps-res-status');
  if (statusBadge) {
    statusBadge.textContent = vehicle.status;
    statusBadge.className = 'badge'; // Reset
    if (vehicle.status === 'Active') {
      statusBadge.classList.add('badge-success');
    } else if (vehicle.status === 'Under Maintenance') {
      statusBadge.classList.add('badge-danger');
    } else {
      statusBadge.classList.add('badge-secondary');
    }
  }
  
  // Position Map Markers
  const currentMarker = document.getElementById('gps-map-current-marker');
  const stopMarker = document.getElementById('gps-map-stop-marker');
  
  if (currentMarker) {
    currentMarker.style.left = `${gpsData.markerX}%`;
    currentMarker.style.top = `${gpsData.markerY}%`;
  }
  if (stopMarker) {
    stopMarker.style.left = `${gpsData.stopX}%`;
    stopMarker.style.top = `${gpsData.stopY}%`;
  }
  
  // Show results view
  document.getElementById('gps-tracking-results').classList.remove('d-none');
  
  showToast('GPS Signal Acquired', `Telemetry successfully fetched for vehicle ${vehicle.number}.`, 'success');
}

