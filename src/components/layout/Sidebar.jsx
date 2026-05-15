import { BarChart3, BrainCircuit, Gauge, PieChart, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/", icon: Gauge },
  { label: "Markets", path: "/markets", icon: BarChart3 },
  { label: "Predictions", path: "/predictions", icon: BrainCircuit },
  { label: "Portfolio", path: "/portfolio", icon: PieChart },
];

export default function Sidebar() {
  return (
    <aside className="glass-surface fixed inset-x-3 bottom-3 z-30 rounded-lg p-2 lg:sticky lg:inset-auto lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:w-64 lg:flex-col lg:p-4">
      <div className="mb-6 hidden items-center gap-3 lg:flex">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-ink">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-lg font-black">autoData</p>
          <p className="text-xs text-white/50">NSE intelligence</p>
        </div>
      </div>

      <nav className="grid grid-cols-4 gap-1 lg:grid-cols-1 lg:gap-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              className={({ isActive }) =>
                `flex min-h-12 items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold transition lg:justify-start ${
                  isActive ? "bg-mint text-ink" : "text-white/64 hover:bg-white/8 hover:text-white"
                }`
              }
              end={item.path === "/"}
              key={item.path}
              to={item.path}
              title={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto hidden rounded-lg border border-line bg-white/5 p-3 lg:block">
        <p className="text-xs font-semibold uppercase text-white/45">Model</p>
        <p className="mt-1 text-sm text-white/80">Ensemble LSTM + XGBoost + RF</p>
      </div>
    </aside>
  );
}
