import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import seatRoutes from "./routes/seat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/", seatRoutes);

export default app;