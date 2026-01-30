import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config.js";

// Keep these canonical values in ONE place
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

function dollarsToCents(dollarsString) {
  // Avoid floating point issues by rounding
  const n = Number(dollarsString);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

export default function CreateListingForm({ onCreated }) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // dollars in UI
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [condition, setCondition] = useState(CONDITION_OPTIONS[1].value);
  const [brand, setBrand] = useState("");
  const [technicalSpecs, setTechnicalSpecs] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("You must be logged in to create a listing.");
      return;
    }

    const priceCents = dollarsToCents(price);
    if (priceCents === null || priceCents <= 0) {
      setError("Price must be a valid number greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          price_cents: priceCents,
          category,
          condition,
          brand: brand.trim(),
          technical_specs: technicalSpecs.trim(),
          image_url: imageUrl.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Create listing failed (${res.status})`;
        throw new Error(msg);
      }

      // Reset form on success
      setTitle("");
      setPrice("");
      setCategory(CATEGORY_OPTIONS[0].value);
      setCondition(CONDITION_OPTIONS[1].value);
      setBrand("");
      setTechnicalSpecs("");
      setImageUrl("");

      // Notify parent (Dashboard) to refresh listings
      if (onCreated) onCreated(data.listing);
    } catch (err) {
      setError(err.message || "Create listing failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="createListing">
      <h2>Create a new listing</h2>

      <form onSubmit={handleSubmit} className="createListing__form">
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            required
            placeholder='e.g., Dell 27" 144Hz Monitor'
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
            placeholder="199.99"
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
            placeholder="Dell, Lenovo, Audio-Technica..."
          />
        </label>

        <label>
          Technical specs
          <textarea
            value={technicalSpecs}
            onChange={(e) => setTechnicalSpecs(e.target.value)}
            required
            rows={4}
            placeholder="Key specs and notes (free-form)"
          />
        </label>

        <label>
          Image URL
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            type="url"
            required
            placeholder="https://..."
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button disabled={submitting} type="submit">
          {submitting ? "Creating..." : "Create listing"}
        </button>
      </form>
    </section>
  );
}
