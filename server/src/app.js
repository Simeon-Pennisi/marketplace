// express app
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import router from "./routes/listings.js";
import authRouter from "./routes/auth.js";

const app = express();

// CORS configuration

// app.use(cors()); // the dev only version

app.use(
  cors({
    // here is the deployment version
    origin: [
      "http://localhost:5173",
      "https://marketplace-demo-lx2a.onrender.com",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/listings", router);

export default app;
