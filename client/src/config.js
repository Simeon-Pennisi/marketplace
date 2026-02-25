// client/src/config.js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
