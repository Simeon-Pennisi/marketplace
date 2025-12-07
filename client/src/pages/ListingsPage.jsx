// client/src/pages/ListingsPage.jsx
import { useEffect, useState } from "react";
import "../styles/pages/listings.css";
import { API_BASE_URL } from "../config";

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (category) params.set("category", category);
        if (brand) params.set("brand", brand);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (sort) params.set("sort", sort);

        const queryString = params.toString();
        const url = `${API_BASE_URL}/listings${
          queryString ? `?${queryString}` : ""
        }`;

        console.log("Fetching listings from:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await res.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching listings");
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [category, brand, minPrice, maxPrice, sort]);

  return (
    <div className="page listings-page">
      <h1>Browse Listings</h1>

      <section className="filters">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="monitor">Monitor</option>
            <option value="laptop">Laptop</option>
            <option value="audio">Audio</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <input
            type="text"
            placeholder="e.g. Dell, Lenovo"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Min Price ($)</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Max Price ($)</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </section>

      {loading && <p>Loading listings...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p>No listings found. Try adjusting your filters.</p>
      )}

      <section className="listings-grid">
        {listings.map((listing) => (
          <article key={listing.id} className="listing-card">
            {listing.image_url && (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="listing-image"
              />
            )}
            <div className="listing-body">
              <h2 className="listing-title">{listing.title}</h2>
              <p className="listing-brand">
                {listing.brand} • {listing.condition}
              </p>
              <p className="listing-price">${listing.price.toFixed(2)}</p>
              <p className="listing-rating">
                ⭐ {Number(listing.avg_rating).toFixed(1)} (
                {listing.review_count} reviews)
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ListingsPage;
