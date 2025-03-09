import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const Toast = ({ id, message, type = 'info' }: ToastProps) => {
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-xl px-4 py-2 shadow-lg ${typeStyles[type]}`}
    >
      {message}
    </motion.div>
  );
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handler = (e: CustomEvent<ToastProps>) => {
      setToasts((current) => [...current, e.detail]);
      setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== e.detail.id));
      }, 3000);
    };

    window.addEventListener('toast', handler as EventListener);
    return () => window.removeEventListener('toast', handler as EventListener);
  }, []);

  return (
    <div className="fixed top-4 right-4 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const event = new CustomEvent('toast', {
    detail: { id: crypto.randomUUID(), message, type },
  });
  window.dispatchEvent(event);
};