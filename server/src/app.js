// express app
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import router from "./routes/listings.js";
import authRouter from "./routes/auth.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://marketplace-client-cvgy.onrender.com",
];

// CORS configuration
// app.use(cors()); // is the dev only version
app.use(
  cors({
    // here is the deployment version
    origin(origin, callback) {
      // allow non-browser requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/listings", router);

export default app;
