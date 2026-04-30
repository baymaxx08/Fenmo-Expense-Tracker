import React from 'react';

/**
 * Toast notification component
 * Displays messages with auto-dismiss
 */
export function Toast({ message, type = 'success', visible = true, onDismiss }) {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${bgColor} shadow-lg animate-pulse z-50`}>
      {message}
    </div>
  );
}
