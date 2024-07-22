import { useEffect } from 'react';

export default function Alert({ message, type, onClose }) {
  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`border-l-4 p-4 ${alertStyles[type]}`} role="alert">
      <p className="font-bold">{type === 'success' ? 'Success' : 'Error'}</p>
      <p>{message}</p>
    </div>
  );
}