import { Link } from "react-router-dom";
import "../styles/pages/home.css";

function HomePage() {
  return (
    <div className="hero">
      <img
        className="hero-background"
        src="/images/marketplace_background.jpg"
        alt="blurry image of desk with computer"
      />
      <div className="hero-overlay">
        <h1>Buy & Sell Tech Gear</h1>
        <p>A marketplace for developers and creators</p>

        <button>
          <Link to="/listings">Browse Listings</Link>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
