import { Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Profissionais } from "../pages/Profissionais";
import { Servicos } from "../pages/Servicos";
import { Agendamentos } from "../pages/Agendamentos";
import { MeusAgendamentos } from "../pages/MeusAgendamentos";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profissionais"
        element={
          <ProtectedRoute>
            <Profissionais />
          </ProtectedRoute>
        }
      />

      <Route path="/servicos" element={<Servicos />} />

      <Route path="/agendamentos" element={<Agendamentos />} />

      <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
    </Routes>
  );
}
