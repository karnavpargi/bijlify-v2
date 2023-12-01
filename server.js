require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });
const express = require('express');
const helmet = require('helmet');
const { parse } = require('node:url');
const http = require('node:http');
const morgan = require('morgan');
const { version, name, engines } = require('./package.json');
// const rateLimit = require('express-rate-limit');
const logger = require('./app/common/logger')('server.js');
const wss = require('./app/webSockets/socket.handler');

const routes = require('./app/routes');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3500;

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(201).send({ name, port, version, engines });
});

// const limiter = rateLimit({ windowMs: 10 * 1000, max: 100 });
app.use(routes);

server.on('upgrade', (req, socket, head) => {
  const { pathname } = parse(req.url);
  if (pathname === '/bijlify') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  logger.info(`Successfully listening on port: ${port} with environment: ${process.env.NODE_ENV || 'local'}`);
});
