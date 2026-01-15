require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Bingo backend running on Render 🚀");
});

// Routes
app.use("/api", require("./routes/api"));
app.use("/admin", require("./routes/admin"));
app.use("/webhook", require("./routes/webhook"));

const server = http.createServer(app);

// Socket.IO
require("./sockets")(server);

// Render requires 0.0.0.0
const PORT = process.env.PORT || 10000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
