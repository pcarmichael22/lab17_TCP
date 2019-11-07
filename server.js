'use strict';

const net = require('net');

const port = process.env.PORT || 3001;
const server = net.createServer();
const events = {
  READ_ERROR: 'read_error', 
  WRITE_ERROR: 'write_error', 
  WRITE_SUCCESS: 'write_success'
};

server.listen(port, () => console.log(`Server up on ${port}`) );

let socketPool = {};

server.on('connection', (socket) => {
  const id = `Socket-${Math.random()}`;
  socketPool[id] = socket;
  socket.on('data', (buffer) => dispatchEvent(buffer));
  socket.on('close', () => {
    delete socketPool[id];
  });
});

function broadcast(event, text){
  for (let socket in socketPool) {
    console.log('broadcasting to socket')
    socketPool[socket].write(`${event}—${text}`);
  }
}

let dispatchEvent = (buffer) => {
  let text = buffer.toString().trim();
  let parsedText = text.split('—');
  let event = parsedText[0];
  let value = parsedText[1];
  switch(event) {
    case events.READ_ERROR: 
      broadcast(event, value);
      break;
    case events.WRITE_ERROR:
      broadcast(event, value);
      break;
    case events.WRITE_SUCCESS:
      broadcast(event, value);
      break;
    default:
      broadcast(event, 'unknown event occured')
  }

};