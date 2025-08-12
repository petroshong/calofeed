import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Upload, Check, AlertCircle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineSyncProps {
  onSyncComplete?: () => void;
}

export const OfflineSync: React.FC<OfflineSyncProps> = ({ onSyncComplete }) => {
  const isOnline = useOnlineStatus();
  const [pendingSync, setPendingSync] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Check for pending offline data
    const checkPendingData = () => {
      const offlineData = localStorage.getItem('offline_meals');
      if (offlineData) {
        const meals = JSON.parse(offlineData);
        setPendingSync(meals.length);
      }
    };

    checkPendingData();
  }, []);

  useEffect(() => {
    // Auto-sync when coming back online
    if (isOnline && pendingSync > 0) {
      syncOfflineData();
    }
  }, [isOnline, pendingSync]);

  const syncOfflineData = async () => {
    if (!isOnline) return;

    setSyncing(true);
    try {
      const offlineData = localStorage.getItem('offline_meals');
      if (offlineData) {
        const meals = JSON.parse(offlineData);
        
        // Sync each meal
        for (const meal of meals) {
          // Here you would call your meal service to upload
          console.log('Syncing meal:', meal);
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        }

        // Clear offline data after successful sync
        localStorage.removeItem('offline_meals');
        setPendingSync(0);
        onSyncComplete?.();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (!pendingSync) return null;

  return (
    <div className="fixed top-16 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-40">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isOnline ? (
            syncing ? (
              <Upload className="w-5 h-5 text-blue-600 animate-bounce" />
            ) : (
              <Wifi className="w-5 h-5 text-green-600" />
            )
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {syncing ? 'Syncing...' : isOnline ? 'Ready to Sync' : 'Offline Mode'}
            </h3>
            {syncing && (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {syncing 
              ? `Uploading ${pendingSync} meals...`
              : isOnline 
                ? `${pendingSync} meals ready to upload`
                : `${pendingSync} meals saved offline`
            }
          </p>
          {isOnline && !syncing && (
            <button
              onClick={syncOfflineData}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Sync Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};