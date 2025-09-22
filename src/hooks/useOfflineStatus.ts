import { useState, useEffect } from 'react';
import { ErrorHandler, ErrorType, ErrorSeverity } from '../utils/errorHandler';

export interface OfflineQueueItem {
  id: string;
  action: () => Promise<any>;
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      ErrorHandler.handle(new Error('Connection lost'), {
        type: ErrorType.OFFLINE,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'You\'re now offline. Some features may not be available.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToOfflineQueue = (
    action: () => Promise<any>,
    data: any,
    maxRetries: number = 3
  ): string => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const queueItem: OfflineQueueItem = {
      id,
      action,
      data,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries
    };

    setOfflineQueue(prev => [...prev, queueItem]);
    
    // Store in localStorage for persistence
    try {
      const stored = localStorage.getItem('offline_queue') || '[]';
      const queue = JSON.parse(stored);
      queue.push({
        id: queueItem.id,
        data: queueItem.data,
        timestamp: queueItem.timestamp,
        retryCount: queueItem.retryCount,
        maxRetries: queueItem.maxRetries
      });
      localStorage.setItem('offline_queue', JSON.stringify(queue));
    } catch (error) {
      console.warn('Could not save to offline queue:', error);
    }

    return id;
  };

  const removeFromOfflineQueue = (id: string) => {
    setOfflineQueue(prev => prev.filter(item => item.id !== id));
    
    try {
      const stored = localStorage.getItem('offline_queue') || '[]';
      const queue = JSON.parse(stored);
      const filtered = queue.filter((item: any) => item.id !== id);
      localStorage.setItem('offline_queue', JSON.stringify(filtered));
    } catch (error) {
      console.warn('Could not update offline queue:', error);
    }
  };

  const processOfflineQueue = async () => {
    if (!isOnline || offlineQueue.length === 0) return;

    const itemsToProcess = [...offlineQueue];
    
    for (const item of itemsToProcess) {
      try {
        await item.action();
        removeFromOfflineQueue(item.id);
      } catch (error) {
        if (item.retryCount < item.maxRetries) {
          // Increment retry count
          setOfflineQueue(prev => 
            prev.map(queueItem => 
              queueItem.id === item.id 
                ? { ...queueItem, retryCount: queueItem.retryCount + 1 }
                : queueItem
            )
          );
        } else {
          // Max retries reached, remove from queue and log error
          removeFromOfflineQueue(item.id);
          ErrorHandler.handle(error, {
            context: { offlineQueueItem: item.id, data: item.data }
          });
        }
      }
    }
  };

  const clearOfflineQueue = () => {
    setOfflineQueue([]);
    localStorage.removeItem('offline_queue');
  };

  return {
    isOnline,
    offlineQueue,
    addToOfflineQueue,
    removeFromOfflineQueue,
    processOfflineQueue,
    clearOfflineQueue
  };
}