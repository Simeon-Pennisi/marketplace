// DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import CreateListingForm from "../components/CreateListingForm.jsx";
import EditListingForm from "../components/EditListingForm.jsx";
import { API_BASE_URL } from "../config.js";
import DeleteListingForm from "../components/DeleteListingForm.jsx";

export default function DashboardPage() {
  const { user, token, logout, authNotice, authError } = useAuth();

  console.log("DashboardPage render:", {
    user,
    authNotice,
    authError,
    API_BASE_URL,
  });

  const [myListings, setMyListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [deleteListing, setDeleteListing] = useState(null);
  const [loadingMine, setLoadingMine] = useState(true);
  const [myError, setMyError] = useState(null);

  async function loadMyListings() {
    if (!token) return;

    setLoadingMine(true);
    setMyError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/listings/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message || `Failed to load my listings. (${res.status})`,
        );
      }

      setMyListings(data?.listings ?? []);
    } catch (err) {
      setMyError(err.message);
      setMyListings([]);
      console.error(err);
    } finally {
      setLoadingMine(false);
    }
    //
    // const res = await fetch("http/localhost:4000/api/listings/mine", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // useEffect(() => {
    //   if (!token) return;
    //   loadMyListings();
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [token]);
    // // ...render below the useEffect

    // if (!res.ok) {
    //   console.log("Failed to load /mine:", res.status);
    //   return;
    // }

    // const data = await res.json();
    // // setListings(data.listings);
    // setMyListings(data.listings);
    // //
  }

  useEffect(() => {
    if (!token) {
      setLoadingMine(false);
      setMyListings([]);
      return;
    }
    loadMyListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="page dashboard-page">
      <h1>Seller Dashboard</h1>

      {authNotice && <p className="notice">{authNotice}</p>}
      {authError && <p className="error">{authError}</p>}
      {myError && <p className="error">{myError}</p>}

      <p>
        Signed in as: <strong>{user?.email}</strong>
      </p>
      {/* keep an eye on next line */}
      {user?.name && <p>Name: {user.name}</p>}
      <button onClick={() => logout()}>Logout</button>

      <hr />
      <CreateListingForm onCreated={(listing) => loadMyListings()} />

      {editingListing && (
        <>
          <hr />
          <EditListingForm
            listing={editingListing}
            onCancel={() => setEditingListing(null)}
            onSaved={() => {
              setEditingListing(null);
              loadMyListings();
            }}
          />
        </>
      )}

      {deleteListing && (
        <DeleteListingForm
          listing={deleteListing}
          onCancel={() => setDeleteListing(null)}
          onDeleted={(deletedId) => {
            setMyListings((prev) => prev.filter((x) => x.id !== deletedId));
            setDeleteListing(null);
          }}
        />
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

              <button type="button" onClick={() => setDeleteListing(l)}>
                Delete
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
