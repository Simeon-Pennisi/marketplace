import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import * as authApi from "../api/auth";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(authApi.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Hydrate user from token on initial load
  useEffect(() => {
    async function hydrate() {
      try {
        const existingToken = authApi.getToken();
        if (!existingToken) {
          setUser(null);
          setTokenState(null);
          return;
        }

        const data = await authApi.me(existingToken);
        setUser(data.user);
        setTokenState(existingToken);
      } catch (err) {
        // Token invalid/expired or user missing
        console.warn("Auth hydrate failed:", err.message);
        authApi.clearToken();
        setUser(null);
        setTokenState(null);
        setAuthError("Session expired. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    }

    hydrate();
  }, []);

  async function register({ name, email, password }) {
    const data = await authApi.register({ name, email, password });
    authApi.setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  }

  async function login({ email, password }) {
    const data = await authApi.login({ email, password });
    authApi.setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    authApi.clearToken();
    setTokenState(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
