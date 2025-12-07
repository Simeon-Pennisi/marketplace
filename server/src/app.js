// express app
const express = require("express");
const cors = require("cors");
const healthRouter = require("./routes/health");
const listingsRouter = require("./routes/listings");

const app = express();

// CORS configuration
// appeared to cause issues with cookie handling in some cases
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Vite default port
//     credentials: true,
//   })
// );

app.use(cors()); // 👈 allow all origins for local dev

app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/listings", listingsRouter);

// Later you'll add:
// app.use('/api/auth', authRouter)
// etc.

module.exports = app;
