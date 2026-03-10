import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell flex items-center justify-center px-4 py-12">
      <div className="section-card w-full max-w-md p-8">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Welcome back</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Login to KP Fresh Dairy</h2>
        </div>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input-shell w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-shell w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <button onClick={handleLogin} className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-slate-600">
          Do not have an account?{" "}
          <button onClick={() => navigate("/signup")} className="font-semibold text-[var(--brand)] hover:underline">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
