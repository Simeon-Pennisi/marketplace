import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} TechMarket by Simeon Pennisi \n All rights
        reserved.
      </p>
    </footer>
  );
}

export default Footer;
