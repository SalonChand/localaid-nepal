import { createSupportRequest } from './requestService';

export const saveOfflineRequest = (requestData) => {
  // Get existing offline requests, or start an empty array
  const existing = JSON.parse(localStorage.getItem('offlineRequests') || '[]');
  
  // Add the new request with a temporary local ID
  existing.push({ ...requestData, _localId: Date.now() });
  
  // Save it back to the phone's memory
  localStorage.setItem('offlineRequests', JSON.stringify(existing));
};

export const getOfflineRequests = () => {
  return JSON.parse(localStorage.getItem('offlineRequests') || '[]');
};

export const clearOfflineRequests = () => {
  localStorage.removeItem('offlineRequests');
};

export const syncOfflineRequests = async () => {
  const requests = getOfflineRequests();
  if (requests.length === 0) return 0;

  let syncedCount = 0;
  
  // Loop through every saved request and send it to the real backend
  for (const req of requests) {
    try {
      const dataToSync = { ...req };
      delete dataToSync._localId; // Remove the temporary local ID
      
      await createSupportRequest(dataToSync);
      syncedCount++;
    } catch (err) {
      console.error("Failed to sync a request", err);
    }
  }
  
  // Clear the phone's memory once they are all safely synced
  clearOfflineRequests();
  return syncedCount;
};