import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div className="p-4 md:p-6 md:pb-0">
      <div className="glass-panel flex items-center justify-between px-5 py-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations</div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;
