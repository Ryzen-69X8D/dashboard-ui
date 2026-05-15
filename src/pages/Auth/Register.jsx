import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-2rem)] place-items-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="mb-6">
          <p className="text-sm text-white/50">Create workspace</p>
          <h1 className="text-2xl font-black text-white">Register</h1>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {[
            ["full_name", "Full name", "text", "name"],
            ["email", "Email", "email", "email"],
            ["password", "Password", "password", "new-password"],
            ["confirmPassword", "Confirm password", "password", "new-password"],
          ].map(([name, label, type, autoComplete]) => (
            <label className="grid gap-2" key={name}>
              <span className="text-xs font-semibold uppercase text-white/55">{label}</span>
              <input
                autoComplete={autoComplete}
                className="min-h-11 rounded-lg border border-line bg-white/7 px-3 text-sm text-white outline-none focus:border-mint"
                name={name}
                onChange={updateForm}
                type={type}
                value={form[name]}
              />
            </label>
          ))}
          {error ? <p className="rounded-lg border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p> : null}
          <Button disabled={loading} icon={UserPlus} type="submit">
            {loading ? "Creating" : "Register"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-white/55">
          Have an account?{" "}
          <Link className="font-semibold text-mint" to="/login">
            Login
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
