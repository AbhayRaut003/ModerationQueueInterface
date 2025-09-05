import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeToast } from '../store/toastSlice';
import { undoAction } from '../store/moderationSlice';
import { CheckCircle, XCircle, Info, Undo2, X } from 'lucide-react';

const ToastNotifications: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.toast);

  useEffect(() => {
    const timers = notifications.map((notification) => {
      if (!notification.canUndo) {
        return setTimeout(() => {
          dispatch(removeToast(notification.id));
        }, 5000);
      }
      
      // Undo notifications stay longer
      return setTimeout(() => {
        dispatch(removeToast(notification.id));
      }, 8000);
    });

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  const handleUndo = (undoId: string, toastId: string) => {
    if (undoId) {
      dispatch(undoAction(undoId));
      dispatch(removeToast(toastId));
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getBgColor(notification.type)} rounded-lg p-3 sm:p-4 shadow-lg border border-gray-200
            transform transition-all duration-300 ease-in-out
            animate-slide-in-right
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            
            <div className="ml-2 sm:ml-3 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {notification.message}
              </p>
            </div>

            <div className="ml-2 sm:ml-4 flex items-center space-x-1 sm:space-x-2">
              {notification.canUndo && notification.undoId && (
                <button
                  onClick={() => handleUndo(notification.undoId!, notification.id)}
                  className="inline-flex items-center px-1.5 sm:px-2 py-1 text-xs font-medium rounded text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50 transition-colors"
                >
                  <Undo2 className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline ml-1">Undo</span>
                </button>
              )}
              
              <button
                onClick={() => dispatch(removeToast(notification.id))}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotifications;