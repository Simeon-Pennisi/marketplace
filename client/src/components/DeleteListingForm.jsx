import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config.js";

export default function DeleteListingForm({ listing, onDeleted, onCancel }) {
  const { token /*, logout */ } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("You must be logged in to delete a listing.");
      return;
    }
    if (!listing?.id) {
      setError("Missing listing id.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${listing.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // DELETE often returns 204 (no body). Only parse JSON if present.
      const hasJson = res.headers
        .get("content-type")
        ?.includes("application/json");

      const data = hasJson ? await res.json().catch(() => null) : null;

      // Status-specific UX
      if (res.status === 401) {
        setError("Your session expired. Please log in again.");
        // Optional:
        // logout("Session expired. Please log in again.");
        return;
      }

      if (res.status === 403) {
        setError("Forbidden: you can’t delete a listing you don’t own.");
        return;
      }

      if (res.status === 404) {
        setError("This listing no longer exists (it may have been deleted).");
        return;
      }

      if (!res.ok) {
        setError(data?.message || `Delete failed (${res.status}).`);
        return;
      }

      // Success: 204 or 200
      onDeleted?.(listing.id);
    } catch (err) {
      setError(err?.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!listing) return null;

  return (
    <section className="deleteListing">
      <h2>Delete listing</h2>

      <p>
        Are you sure you want to delete <strong>{listing.title}</strong>?
      </p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="deleteListing__form">
        <div style={{ display: "flex", gap: 12 }}>
          <button disabled={submitting} type="submit">
            {submitting ? "Deleting..." : "Delete listing"}
          </button>

          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
