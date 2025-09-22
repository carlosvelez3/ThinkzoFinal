import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Clock } from 'lucide-react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

export function OfflineIndicator() {
  const { isOnline, offlineQueue } = useOfflineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
            {offlineQueue.length > 0 && (
              <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-orange-300">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{offlineQueue.length} pending</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {isOnline && offlineQueue.length > 0 && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Syncing...</span>
            <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-blue-300">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{offlineQueue.length} items</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}