import { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function Profile() {
  const { user, setUser, logout } = useAuth();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    if (!user) {
      api
        .get("auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => {});
    }
  }, [user, setUser]);

  useEffect(() => {
    api
      .get("subscriptions/")
      .then((res) => setSubs(res.data))
      .catch(() => setSubs([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
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
              <div className="text-lg font-semibold mb-2">My Subscriptions</div>
              {subs.length === 0 ? (
                <div className="text-gray-500">No subscriptions</div>
              ) : (
                <div className="space-y-2">
                  {subs.map((s) => (
                    <div key={s.id} className="rounded border p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Subscription #{s.id}</div>
                        {"months" in s ? (
                          <div className="text-sm text-gray-600">Months: {s.months} • Total: ₹ {s.total_price}</div>
                        ) : null}
                        <div className="text-sm text-gray-600">Qty: {s.quantity}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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

export default Profile;
