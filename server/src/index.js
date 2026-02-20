// entry point
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ TechMarket API running on PORT ${PORT}`);
});

app.get("/", (req, res) => res.send("TechMarket API. Try /api/health"));
