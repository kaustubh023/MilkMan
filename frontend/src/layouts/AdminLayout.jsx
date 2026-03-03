import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;

