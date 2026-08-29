require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { connectDB } = require("./db"); // <-- Add this

const buildRoutes = require("./routes");

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || "http://localhost:5173, http://10.124.220.3:5173")
  .split(",")
  .map((s) => s.trim());

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Connect to Database
connectDB(); // <-- Add this

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

server.listen(PORT, () => {
  console.log(`Smart Helmet backend running on http://localhost:${PORT}`);
});