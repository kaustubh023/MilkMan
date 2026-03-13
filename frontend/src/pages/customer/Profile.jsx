import { useEffect, useState } from "react";
import Navbar from "../../layout/Navbar";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axios";

function Profile() {
  const { user, setUser, logout } = useAuth();
  const [subs, setSubs] = useState([]);
  const activeSubs = subs.filter((sub) => sub.is_active);
  const totalSpend = activeSubs.reduce((sum, sub) => sum + Number(sub.total_price || 0), 0);
  const totalUnits = activeSubs.reduce((sum, sub) => sum + Number(sub.quantity || 0), 0);

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
    <div className="app-shell">
      <Navbar />
      <main className="app-section max-w-5xl pb-16">
        <div className="section-card mb-8 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Customer profile</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your account and active delivery plans</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            A stronger profile page gives customers a faster read on account details, active subscriptions, and total plan value.
          </p>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="stat-card">
                <div className="text-sm text-slate-500">Active subscriptions</div>
                <div className="mt-2 text-3xl font-semibold">{activeSubs.length}</div>
                <div className="mt-2 text-sm text-slate-500">Plans currently delivering.</div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-slate-500">Projected spend</div>
                <div className="mt-2 text-3xl font-semibold">Rs. {totalSpend.toFixed(2)}</div>
                <div className="mt-2 text-sm text-slate-500">Total across active plans.</div>
              </div>
              <div className="stat-card">
                <div className="text-sm text-slate-500">Units subscribed</div>
                <div className="mt-2 text-3xl font-semibold">{totalUnits}</div>
                <div className="mt-2 text-sm text-slate-500">Combined quantity on active plans.</div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
              <div className="section-card p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Account</div>
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Name</div>
                    <div className="mt-1 text-lg font-semibold">{user.full_name}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Email</div>
                    <div className="mt-1 text-base font-medium">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Role</div>
                    <div className="mt-1 inline-flex rounded-full bg-[rgba(31,111,67,0.1)] px-3 py-1 text-sm font-semibold text-[var(--brand-deep)]">
                      {user.role}
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <button className="btn-secondary" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>

              <div className="section-card p-6">
                <div className="mb-4 text-lg font-semibold">My subscriptions</div>
                <p className="mb-5 text-sm leading-6 text-slate-500">
                  Existing subscription data is unchanged. This view only improves readability and summary context.
                </p>
                {subs.length === 0 ? (
                  <div className="rounded-[24px] bg-[rgba(247,243,234,0.9)] p-6 text-slate-500">No subscriptions yet.</div>
                ) : (
                  <div className="space-y-3">
                    {subs.map((s) => (
                      <div key={s.id} className="rounded-[24px] border border-[rgba(31,111,67,0.12)] bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="font-semibold">Subscription #{s.id}</div>
                            <div className="mt-1 text-sm text-slate-500">Quantity: {s.quantity}</div>
                            {"months" in s ? (
                              <div className="mt-1 text-sm text-slate-500">
                                Months: {s.months} | Total: Rs. {Number(s.total_price || 0).toFixed(2)}
                              </div>
                            ) : null}
                          </div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                              s.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {s.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="section-card p-10 text-slate-500">Loading profile...</div>
        )}
      </main>
    </div>
  );
}

export default Profile;
