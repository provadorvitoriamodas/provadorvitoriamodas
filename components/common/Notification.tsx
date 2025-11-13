import React, { useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';

const Notification: React.FC = () => {
  const { notification, hideNotification } = useAppContext();

  useEffect(() => {
    if (notification.isOpen) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.isOpen, hideNotification]);

  if (!notification.isOpen) return null;

  const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-5 right-5 z-50 p-4 rounded-md text-white ${bgColor} shadow-lg`}>
      <div className="flex items-center justify-between">
        <p className="mr-4">{notification.message}</p>
        <button onClick={hideNotification} className="text-xl font-bold leading-none hover:text-gray-200">&times;</button>
      </div>
    </div>
  );
};

export default Notification;
