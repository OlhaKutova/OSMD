/**
 * Module dependencies.
 */

const
  app = require('../app'),
  debug = require('debug')('server:www'),
  http = require('http'),
  config = require('../config/config'),
  mongoose = require('../libs/mongoose');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || config.server.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log(`Server started on 127.0.0.1:${port}`);
}


/**
 * Listen on provided port, on all network interfaces.
 */
mongoose.connection.on('open', (err) => {
  if (err) {
    throw err;
  }
  console.log(`Mongoose connected to ${config.mongoose.mongolab.host}`);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});