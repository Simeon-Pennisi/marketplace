// DashboardPage.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, logout, authNotice, authError } = useAuth();

  console.log("DashboardPage render:", { user, authNotice, authError });

  useEffect(() => {
    async function loadMyListings() {
      const res = await fetch("http/localhost:4000/api/listings/mine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setListings(data.listings);
    }

    loadMyListings();
  }, [token]);

  return (
    <div className="page dashboard-page">
      <h1>Seller Dashboard</h1>

      <p>
        Signed in as: <strong>{user?.email}</strong>
      </p>
      {user?.name && <p>Name: {user.name}</p>}

      {/* <button onClick={logout}>Logout</button> */}
      <button onClick={() => logout()}>Logout</button>

      <hr />

      <p>
        Chapter 4 will populate this with listing metrics (favorites, category
        averages, simulated orders).
      </p>

      {authNotice && <p className="notice">{authNotice}</p>}
      {authError && <p className="error">{authError}</p>}
    </div>
  );
}
