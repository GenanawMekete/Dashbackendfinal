require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bot from "./bot/index.js";

require('./config/db');

app.get("/", (req, res) => {
  res.send("Bingo backend running 🚀");
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Bingo backend running 🚀");
});

// Routes
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));
app.use('/webhook', require('./routes/webhook'));

const server = http.createServer(app);
require('./sockets')(server);
app.post("/webhook", (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
