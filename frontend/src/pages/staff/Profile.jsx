import { useEffect } from "react";
import Navbar from "../../layout/Navbar";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axios";

function StaffProfile() {
  const { user, setUser, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      api
        .get("auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => {});
    }
  }, [user, setUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
        {user ? (
          <div className="rounded-xl border bg-white p-6 space-y-2">
            <div>
              <span className="font-medium">Name: </span>
              {user.full_name}
            </div>
            <div>
              <span className="font-medium">Email: </span>
              {user.email}
            </div>
            <div>
              <span className="font-medium">Role: </span>
              {user.role}
            </div>
            <div className="pt-4">
              <button
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Loading...</div>
        )}
      </main>
    </div>
  );
}

export default StaffProfile;
