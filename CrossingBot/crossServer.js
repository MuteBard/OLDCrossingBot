const tmi = require('tmi.js')
const secret = require('./secret/sealed')

var options = {
  options : {
    debug : true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: "CrossingBot",
    password: secret.password
  },
  channels: ["MidnightFreeze", "MuteBard"]
};

var client = new tmi.client(options);
client.connect()

client.on('connected', (address, port) => {
  console.log("Address: "+address+ "\nPort: "+ port);
  client.action("MuteBard", "NotLikeThis");
});
