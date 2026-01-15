require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));
app.use('/webhook', require('./routes/webhook'));

const server = http.createServer(app);
require('./sockets')(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Backend running on ${PORT}`));
