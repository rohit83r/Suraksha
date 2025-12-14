const AlertToast = ({ alert }) => {
  if (!alert) return null;

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50">
      🚨 {alert.type} — {alert.name}
    </div>
  );
};

export default AlertToast;
