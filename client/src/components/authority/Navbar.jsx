export default function Navbar() {
  return (
    <div className="h-16 bg-[#020617] flex items-center justify-between px-6 border-b border-gray-800">
      <h1 className="text-2xl font-bold text-cyan-400">Suraksha</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-300">Authority</div>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm">
          Logout
        </button>
      </div>
    </div>
  );
}
