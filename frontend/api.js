const BACKEND_URL = window.location.origin.includes('8081') ? '' : 'http://localhost:8081';

async function fetchDb() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/sync`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('fleet_db', JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("Failed to fetch database from server, using localStorage:", e);
  }
  return JSON.parse(localStorage.getItem('fleet_db')) || {};
}

// Initialize deletion tracking queue
window.deletedIds = window.deletedIds || {
  deletedVehicleIds: [],
  deletedDriverIds: [],
  deletedTripIds: [],
  deletedFuelIds: [],
  deletedMaintenanceIds: [],
  deletedEmployeeIds: [],
  deletedRepairIds: [],
  deletedBreakdownIds: [],
  deletedAlertIds: []
};

async function saveDb(data) {
  // Merge the tracked deleted IDs into the POST payload
  const payload = {
    ...data,
    ...window.deletedIds
  };

  try {
    const res = await fetch(`${BACKEND_URL}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const updatedData = await res.json();
      // On success, clear the deletion queues
      for (const key in window.deletedIds) {
        window.deletedIds[key] = [];
      }
      localStorage.setItem('fleet_db', JSON.stringify(updatedData));
      return updatedData;
    } else {
      console.error("Failed to save database to server:", res.statusText);
    }
  } catch (e) {
    console.error("Failed to save database to server:", e);
  }
  // Local fallback
  localStorage.setItem('fleet_db', JSON.stringify(data));
  return data;
}
