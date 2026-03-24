import { Link } from "react-router-dom";
import "../styles/pages/home.css";

function HomePage() {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: "url('/images/marketplace_background.jpg')",
      }}
    >
      <div className="hero-overlay">
        <h1>Buy & Sell Tech Gear</h1>
        <p>A marketplace for developers and creators</p>

        <button className="hero-button">
          <Link to="/listings">Browse Listings</Link>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
