// express app
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
// import listingsRouter from "./routes/listings.js";
import router from "./routes/listings.js";

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
app.use("/api/listings", router);

// Later you'll add:
// app.use('/api/auth', authRouter)
// etc.

export default app;
