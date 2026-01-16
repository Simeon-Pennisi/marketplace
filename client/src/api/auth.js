import { API_BASE_URL } from "../config.js";
// import { API_BASE_URL } from "../config";

const TOKEN_KEY = "techmarket_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};

  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Read JSON or fallback
  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = { message: await res.text() };
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function register({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export async function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function me(token) {
  return request("/auth/me", {
    method: "GET",
    token,
  });
}
