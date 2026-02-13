import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config.js";

const CATEGORY_OPTIONS = [
  { value: "monitor", label: "Monitor" },
  { value: "laptop", label: "Laptop" },
  { value: "audio", label: "Audio" },
  { value: "accessories", label: "Accessories" },
];

const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

function centsToDollars(cents) {
  if (cents == null) return "";
  return (Number(cents) / 100).toFixed(2);
}

function dollarsToCents(dollarsString) {
  const n = Number(dollarsString);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export default function EditListingForm({ listing, onSaved, onCancel }) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [condition, setCondition] = useState(CONDITION_OPTIONS[1].value);
  const [brand, setBrand] = useState("");
  const [technicalSpecs, setTechnicalSpecs] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Prefill whenever listing changes
  useEffect(() => {
    if (!listing) return;

    setTitle(listing.title ?? "");
    setPrice(centsToDollars(listing.price_cents));
    setCategory(listing.category ?? CATEGORY_OPTIONS[0].value);
    setCondition(listing.condition ?? CONDITION_OPTIONS[1].value);
    setBrand(listing.brand ?? "");
    setTechnicalSpecs(listing.technical_specs ?? "");
    setImageUrl(listing.image_url ?? "");
    setError(null);
  }, [listing]);

  // Track whether anything changed (nice UX)
  const isDirty = useMemo(() => {
    if (!listing) return false;
    return (
      title !== (listing.title ?? "") ||
      dollarsToCents(price) !== Number(listing.price_cents) ||
      category !== (listing.category ?? "") ||
      condition !== (listing.condition ?? "") ||
      brand !== (listing.brand ?? "") ||
      technicalSpecs !== (listing.technical_specs ?? "") ||
      imageUrl !== (listing.image_url ?? "")
    );
  }, [
    listing,
    title,
    price,
    category,
    condition,
    brand,
    technicalSpecs,
    imageUrl,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("You must be logged in to edit a listing.");
      return;
    }
    if (!listing?.id) {
      setError("Missing listing id.");
      return;
    }

    const priceCents = dollarsToCents(price);
    if (priceCents === null || priceCents <= 0) {
      setError("Price must be a valid number greater than 0.");
      return;
    }

    // Build PATCH payload (send only what can be updated)
    const payload = {
      title: title.trim(),
      price_cents: priceCents,
      category,
      condition,
      brand: brand.trim(),
      technical_specs: technicalSpecs.trim(),
      image_url: imageUrl.trim(),
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON if present (some responses may be empty)
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Update failed (${res.status})`;
        throw new Error(msg);
      } else if (res.ok) {
        onSaved?.(data?.listing ?? null);
        return;
      }
      // if 'else if' does not work
      // onSaved?.(data.listing);

      // Status specific UX
      if (res.status === 400) {
        setError(data?.message || "Invalid input. Please check input fields.");
        return;
      }

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        // Optional force logout/redirect
        return;
      }

      if (res.status === 403) {
        setError("Forbidden: Only the seller may edit a listing.");
        return;
      }

      if (res.status === 404) {
        setError(
          "This listing no longer exists. Confirm listing id or contact admin to restore.",
        );
        return;
      }

      // Fallback
      setError(data?.message || `Update failed (${res.status})`);
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!listing) return null;

  return (
    <section className="editListing">
      <h2>Edit listing</h2>

      <form onSubmit={handleSubmit} className="editListing__form">
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            required
          />
        </label>

        <label>
          Price (USD)
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            required
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Condition
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          >
            {CONDITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Brand
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            type="text"
            required
          />
        </label>

        <label>
          Technical specs
          <textarea
            value={technicalSpecs}
            onChange={(e) => setTechnicalSpecs(e.target.value)}
            rows={4}
            required
          />
        </label>

        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            type="url"
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button disabled={submitting || !isDirty} type="submit">
            {submitting ? "Saving..." : "Save changes"}
          </button>

          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
