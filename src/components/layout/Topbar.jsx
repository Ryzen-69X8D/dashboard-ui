import { Bell, LogOut, Search, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Topbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-white/50">Indian market dashboard</p>
        <h1 className="text-2xl font-black text-white md:text-3xl">Trading cockpit</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block min-w-0 sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            className="min-h-11 w-full rounded-lg border border-line bg-white/7 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-mint"
            placeholder="Search tickers"
          />
        </label>

        <button
          className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white/7 text-white/70 transition hover:bg-white/12 hover:text-white"
          title="Notifications"
          type="button"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex min-h-11 items-center gap-3 rounded-lg border border-line bg-white/7 px-3">
          <UserRound className="h-4 w-4 text-mint" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.full_name || "Analyst"}</p>
            <p className="truncate text-xs text-white/45">{isAuthenticated ? user?.email : "demo mode"}</p>
          </div>
        </div>

        {isAuthenticated ? (
          <Button icon={LogOut} onClick={logout} variant="secondary">
            Logout
          </Button>
        ) : null}
        {!isAuthenticated ? (
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            to="/login"
          >
            Login
          </Link>
        ) : null}
      </div>
    </header>
  );
}
