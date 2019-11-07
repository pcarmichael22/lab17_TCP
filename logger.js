'use strict';

const net = require('net');
const client = new net.Socket();

const events = {
  READ_ERROR: 'read_error', 
  WRITE_ERROR: 'write_error', 
  WRITE_SUCCESS: 'write_success'
};

const connect = async () => {
  try {
      await client.connect(3001, 'localhost'); 
      client.on('data', (buffer) => dispatchEvent(buffer));
  } catch(e) {
    console.error(e.toString());
  }
}

let dispatchEvent = (buffer) => {
  let text = buffer.toString().trim();
  let parsedText = text.split('—');
  let event = parsedText[0];
  let value = parsedText[1];
  console.log('message received from server')
  switch(event) {
    case events.READ_ERROR: 
      console.error(event, value);
      break;
    case events.WRITE_ERROR:
      console.error(event, value);
      break;
    case events.WRITE_SUCCESS:
      console.log(event,value);
      break;
    default:
      console.error(`${event}, unknown event received`)
  }

};

connect()

// client.connect(3001, 'localhost', () => {
//   client.write(`${event} some is trying to ${event}`);
//   console.log('App connected to host');
// });




