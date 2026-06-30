import { Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Cadastro } from "../pages/Cadastro";
import { Dashboard } from "../pages/Dashboard";
import { Profissionais } from "../pages/Profissionais";
import { Servicos } from "../pages/Servicos";
import { Agendamentos } from "../pages/Agendamentos";
import { MeusAgendamentos } from "../pages/Cliente/MeusAgendamentos";
import { VerAgendamentos } from "../pages/Cliente/VerAgendamentos";
import { NovoAgendamento } from "../pages/Cliente/NovoAgendamento";
import { Disponibilidades } from "../pages/Disponibilidades";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/cadastro" element={<Cadastro />} />

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

      <Route
        path="/servicos"
        element={
          <ProtectedRoute>
            <Servicos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agendamentos"
        element={
          <ProtectedRoute>
            <Agendamentos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/meus-agendamentos"
        element={
          <ProtectedRoute>
            <MeusAgendamentos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ver-agendamentos"
        element={
          <ProtectedRoute>
            <VerAgendamentos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/novo-agendamento"
        element={
          <ProtectedRoute>
            <NovoAgendamento />
          </ProtectedRoute>
        }
      />

      <Route
        path="/disponibilidades"
        element={
          <ProtectedRoute>
            <Disponibilidades />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
