// AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as authApi from "../api/auth";
import { decodeJwt, getTokenExpiryDate } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(authApi.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const WARNING_SECONDS = 10;

  // Optional: separate "notice" from "error"
  const [authNotice, setAuthNotice] = useState(null);

  // Timer refs (so we can clear them)
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  // helper functions
  function clearSessionTimers() {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
  }

  function scheduleSessionTimers(jwtToken) {
    clearSessionTimers();
    setAuthNotice(null);

    const expiryDate = getTokenExpiryDate(jwtToken);
    if (!expiryDate) return; // can't schedule without exp

    const msUntilExpiry = expiryDate.getTime() - Date.now();

    // Already expired → force logout immediately
    if (msUntilExpiry <= 0) {
      setAuthError("Session expired. Please log in again.");
      logout("Session expired. Please log in again.");
      return;
    }

    const msUntilWarning = msUntilExpiry - WARNING_SECONDS * 1000;

    // Warning timer (only if there's time for it)
    if (msUntilWarning > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setAuthNotice(`Session expires in ${WARNING_SECONDS} seconds.`);
      }, msUntilWarning);
    } else {
      // If token lifespan is < 10s, you can optionally warn immediately
      setAuthNotice(
        `Session expires in ${Math.max(
          1,
          Math.ceil(msUntilExpiry / 1000)
        )} seconds.`
      );
    }

    // Auto logout at expiry
    logoutTimeoutRef.current = setTimeout(() => {
      setAuthError("Session expired. Please log in again.");
      logout("Session expired. Please log in again.");
    }, msUntilExpiry);
  }

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
          scheduleSessionTimers(existingToken);
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
          clearSessionTimers();

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
      clearSessionTimers();
    };
  }, []);

  async function register({ name, email, password }) {
    setAuthError(null);
    setAuthNotice(null);

    const data = await authApi.register({ name, email, password });
    authApi.setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);

    scheduleSessionTimers(data.token);

    return data.user;
  }

  async function login({ email, password }) {
    setAuthError(null);
    setAuthNotice(null);

    const data = await authApi.login({ email, password });
    authApi.setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);

    scheduleSessionTimers(data.token);

    return data.user;
  }

  //   function logout() {
  //     authApi.clearToken();
  //     setTokenState(null);
  //     setUser(null);
  //     setAuthError(null);
  //   }

  function logout(reason) {
    clearSessionTimers();
    authApi.clearToken();
    setTokenState(null);
    setUser(null);
    setAuthNotice(null);

    // Only set authError if we were given a reason
    if (reason) setAuthError(reason);
    else setAuthError(null);
  }

  // useMemo block
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      authError,
      authNotice,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
      setAuthError, // optional: allows pages to set/clear messages
      setAuthNotice, // optional
    }),
    [user, token, isLoading, authError, authNotice]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
