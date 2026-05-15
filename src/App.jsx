import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Markets from "./pages/Markets/Markets";
import Portfolio from "./pages/Portfolio/Portfolio";
import Predictions from "./pages/Predictions/Predictions";

function AppShell({ children }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 px-3 lg:px-4">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Topbar />
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthRoute) {
    return (
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route element={<Dashboard />} path="/" />
        <Route element={<Markets />} path="/markets" />
        <Route element={<Predictions />} path="/predictions" />
        <Route element={<Portfolio />} path="/portfolio" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppShell>
  );
}
