// express app
const express = require("express");
const cors = require("cors");
const healthRouter = require("./routes/health");
const listingsRouter = require("./routes/listings");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/listings", listingsRouter);

// Later you'll add:
// app.use('/api/auth', authRouter)
// etc.

module.exports = app;
