require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const buildRoutes = require("./routes");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

if (!MONGO_URI) {
  console.error("MONGO_URI is not set - check your environment variables.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ ok: true, service: "smart-helmet-backend" });
});

app.use("/api", buildRoutes(io));

io.on("connection", (socket) => {
  console.log(`Dashboard connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Dashboard disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB first - only start accepting HTTP requests once the
// database connection is confirmed, so we fail fast and loudly instead of
// silently hanging on every /api/* request.
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Smart Helmet backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err.message);
});
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});