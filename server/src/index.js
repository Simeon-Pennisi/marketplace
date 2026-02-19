// entry point
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ TechMarket API running on http://localhost:${PORT}`);
});

console.log("Loaded PORT:", process.env.PORT);
console.log("Loaded DB URL:", process.env.DATABASE_URL);

app.get("/", (req, res) => res.send("TechMarket API. Try /api/health"));
