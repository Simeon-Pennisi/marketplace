import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import ListingsPage from "./pages/ListingsPage.jsx";
import ListingDetailPage from "./pages/ListingDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
