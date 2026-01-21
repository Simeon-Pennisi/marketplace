import { Routes, Route, Link } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
// import { useAuth } from "./context/AuthContext.jsx";
// add this to the header or footer when you create them

// Pages
import HomePage from "./pages/HomePage.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import ListingDetailPage from "./pages/ListingDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

// const { user, logout, authNotice, authError } = useAuth();
// add this too
function App() {
  return (
    <>
      {/* Optional nav, keep simple */}
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/listings">Browse</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/* <>
        <p className="logoutWarningNotice">Here is the logout warning</p>
        {authNotice && <div style={{ color: "orange" }}>{authNotice}</div>}
        {authError && <p className="error">{authError}</p>}
      </> */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<ListingDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
