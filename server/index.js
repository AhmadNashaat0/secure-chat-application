const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);

port = process.env.PORT || 5000 ;

app.use(cors());
require('./services/socketio')(server);

server.listen(port, ()=> console.log(`server listen on ${port}`));