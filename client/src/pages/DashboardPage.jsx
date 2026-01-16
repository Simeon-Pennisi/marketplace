import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="page dashboard-page">
      <h1>Seller Dashboard</h1>

      <p>
        Signed in as: <strong>{user?.email}</strong>
      </p>
      {user?.name && <p>Name: {user.name}</p>}

      <button onClick={logout}>Logout</button>

      <hr />

      <p>
        Chapter 4 will populate this with listing metrics (favorites, category
        averages, simulated orders).
      </p>
    </div>
  );
}
