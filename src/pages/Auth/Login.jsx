import { LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-2rem)] place-items-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-ink">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">autoData</p>
            <p className="text-sm text-white/50">Welcome back</p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase text-white/55">Email</span>
            <input
              autoComplete="email"
              className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none focus:border-mint"
              name="email"
              onChange={updateForm}
              type="email"
              value={form.email}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase text-white/55">Password</span>
            <input
              autoComplete="current-password"
              className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none focus:border-mint"
              name="password"
              onChange={updateForm}
              type="password"
              value={form.password}
            />
          </label>
          {error ? <p className="rounded-lg border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p> : null}
          <Button disabled={loading} icon={LogIn} type="submit">
            {loading ? "Signing in" : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-white/55">
          New account?{" "}
          <Link className="font-semibold text-mint" to="/register">
            Register
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
