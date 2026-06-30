import { createContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  email: string;
  perfil: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (email: string, senha: string) => Promise<User>;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, senha: string) {
    const response = await api.post("/auth/login", {
      email,
      senha,
    });

    const { token, usuario } = response.data;

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(usuario));

    setToken(token);
    setUser(usuario);

    return usuario;
  }

  function signOut() {
    localStorage.clear();

    setUser(null);
    setToken(null);

    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
