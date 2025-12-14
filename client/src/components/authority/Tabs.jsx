export default function Tabs({ active, setActive }) {
  const tabs = ["Tourists", "Notifications", "Travel History"];

  return (
    <div className="flex gap-4 border-b border-gray-700 mb-4">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`pb-2 ${
            active === t
              ? "border-b-2 border-cyan-400 text-cyan-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
