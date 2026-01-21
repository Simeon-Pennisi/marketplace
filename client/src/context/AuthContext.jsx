// AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import { decodeJwt, getTokenExpiryDate } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(authApi.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const existingToken = authApi.getToken();

        if (!existingToken) {
          if (!cancelled) {
            setUser(null);
            setTokenState(null);
            setIsLoading(false);
          }
          return;
        }

        const data = await authApi.me(existingToken);

        if (!cancelled) {
          setUser(data.user);
          setTokenState(existingToken);
          setIsLoading(false);
        }
      } catch (err) {
        // IMPORTANT: read and decode BEFORE clearing token
        const existingToken = authApi.getToken();

        // test logs
        console.log("hydrate failed:", err?.message);
        console.log("existingToken:", existingToken);
        console.log("decoded payload:", decodeJwt(existingToken));
        console.log("expiry date:", getTokenExpiryDate(existingToken));
        console.log("existingToken raw:", existingToken);
        console.log("token parts:", existingToken?.split(".")?.length);

        if (!cancelled) {
          setAuthError((prev) => {
            if (prev) return prev;

            if (existingToken) {
              const expiryDate = getTokenExpiryDate(existingToken);
              if (expiryDate) {
                return `Session expired at ${expiryDate.toLocaleTimeString()}. Please log in again.`;
              }
            }
            return "Session expired. Please log in again.";
          });
          authApi.clearToken();
          setUser(null);
          setTokenState(null);
          setIsLoading(false);
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  async function register({ name, email, password }) {
    setAuthError(null);
    const data = await authApi.register({ name, email, password });
    authApi.setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    return data.user;
  }

  async function login({ email, password }) {
    setAuthError(null);
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
    setAuthError(null);
  }

  // useMemo block
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      authError,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
      setAuthError, // optional: allows pages to set/clear messages
    }),
    [user, token, isLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
