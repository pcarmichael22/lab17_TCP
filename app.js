'use strict';

const net = require('net');
const client = new net.Socket();

const fsPromises = require('fs').promises;
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

const readFile = async (file) => {
  try {
      return await fsPromises.readFile(file)
  } catch(e) {
    console.error(e.toString());
    client.write(`${events.READ_ERROR}—${e.toString()}`)
    throw events.READ_ERROR;
  } 
}

const writeFile = async (file, text) => {
  try {
    await fsPromises.writeFile(file, Buffer.from(text))
    client.write(`${events.WRITE_SUCCESS}—${file}`)
  } catch(e) {
    console.error(e.toString())
    client.write(`${events.WRITE_ERROR}—${e.toString()}`)
    throw events.READ_ERROR;
  }
}

let file = process.argv.slice(2).shift();

connect()
.then(readFile(file)
.then(data => {
  let text = data.toString().toLowerCase();
  writeFile(file, text)
}))
.catch(e => {
  console.error(e.toString());
})


// client.connect(3001, 'localhost', () => {
//   client.write(`${event} some is trying to ${event}`);
//   console.log('App connected to host');
// });




