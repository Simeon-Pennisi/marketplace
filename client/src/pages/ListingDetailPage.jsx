// client/src/pages/ListingDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/pages/listingDetail.css";
import { API_BASE_URL } from "../config";

function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/listings/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await res.json();
        setListing(data.listing);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching listing");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="page listing-detail-page">
        <p>Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="page listing-detail-page">
        <p className="error">{error || "Listing not found"}</p>
      </div>
    );
  }

  return (
    <div className="page listing-detail-page">
      <div className="listing-detail-layout">
        <div className="listing-detail-image-wrapper">
          {listing.image_url && (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="listing-detail-image"
            />
          )}
        </div>
        <div className="listing-detail-info">
          <h1>{listing.title}</h1>
          <p className="listing-detail-price">${listing.price.toFixed(2)}</p>
          <p className="listing-detail-meta">
            {listing.brand} • {listing.condition} • {listing.category}
          </p>
          <p className="listing-detail-rating">
            ⭐ {Number(listing.avg_rating).toFixed(1)} ({listing.review_count}{" "}
            reviews)
          </p>

          <h2>Key Specs</h2>
          <p>{listing.technical_specs || "No technical specs provided."}</p>

          <button className="primary-button">Add to Cart</button>
          <button className="secondary-button">Add to Wishlist</button>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailPage;
