import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  // fallback para o localStorage cobre a race condition logo após o login,
  // quando o estado do contexto ainda não foi atualizado mas o token já foi salvo
  const storedToken = localStorage.getItem("token");

  if (!token && !storedToken) {
    return <Navigate to="/" />;
  }

  return children;
}
