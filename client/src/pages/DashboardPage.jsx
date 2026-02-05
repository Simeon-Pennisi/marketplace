// DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import CreateListingForm from "../components/CreateListingForm.jsx";
import EditListingForm from "../components/EditListingForm.jsx";
import { API_BASE_URL } from "../config.js";

export default function DashboardPage() {
  const { user, token, logout, authNotice, authError } = useAuth();

  console.log("DashboardPage render:", { user, authNotice, authError });

  const [myListings, setMyListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [loadingMine, setLoadingMine] = useState(true);

  async function loadMyListings() {
    if (!token) return;

    setLoadingMine(true);
    try {
      const res = await fetch(`${API_BASE_URL}/listings/mine`, {
        headers: { Authorization: "Bearer ${token}" },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to load my listings.");

      setMyListings(data.listings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMine(false);
    }

    const res = await fetch("http/localhost:4000/api/listings/mine", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log("Failed to load /mine:", res.status);
      return;
    }

    const data = await res.json();
    // setListings(data.listings);
    setMyListings(data.listings);
  }

  useEffect(() => {
    loadMyListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="page dashboard-page">
      <h1>Seller Dashboard</h1>
      {authNotice && <p className="notice">{authNotice}</p>}
      {authError && <p className="error">{authError}</p>}
      <p>
        Signed in as: <strong>{user?.email}</strong>
      </p>
      {user?.name && <p>Name: {user.name}</p>}
      <button onClick={() => logout()}>Logout</button>
      <hr />
      <CreateListingForm
        onCreated={(listing) => {
          // fastest UX: optimistic prepend
          setMyListings((prev) => [listing, ...prev]);
          // or call loadMyListings() if you want canonical reload:
          // loadMyListings()
        }}
      />

      {editingListing && (
        <>
          <hr />
          <EditListingForm
            listing={editingListing}
            onCancel={() => setEditingListing(null)}
            onSaved={(updated) => {
              // update in-place
              setMyListings((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l)),
              );
              setEditingListing(null);
            }}
          />
        </>
      )}

      <h2>My listings</h2>
      {loadingMine ? (
        <p>Loading...</p>
      ) : myListings.length === 0 ? (
        <p>No listings yet.</p>
      ) : (
        <ul>
          {myListings.map((l) => (
            <li
              key={l.id}
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <span>
                {l.title} — ${(l.price_cents / 100).toFixed(2)}
              </span>

              <button type="button" onClick={() => setEditingListing(l)}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
      {authNotice && <p className="notice">{authNotice}</p>}
      {authError && <p className="error">{authError}</p>}
    </div>
  );
}
