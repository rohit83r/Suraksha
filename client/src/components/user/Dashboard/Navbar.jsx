import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
export default function Navbar() {
  const dispatch = useDispatch();
  const handleOnClcik = ()=>{
    dispatch(logout());
  }
  return (
    <div className="sticky top-0 z-50 bg-[#020617] border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <Link><h1 className="text-2xl font-bold text-cyan-400">Suraksha</h1>
        </Link>
        <div className="flex gap-4">
          <button className="bg-red-600 cursor-pointer px-4 py-2 rounded-md" onClick={handleOnClcik}  >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
