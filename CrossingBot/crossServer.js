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
// --------------
var client = new tmi.client(options);
var client2 = new tmi.client(options);

client.connect()
client.on('join', (channel,username) => console.log(username))
client.on('chat', (channel, username, message, self) =>{
  if(message.charAt(0) == "!"){
    client.action("MuteBard", `${username["display-name"]} Hello!`)
  }
})
client.on('connected', (address, port) => client.action("MuteBard", "NotLikeThis"));

client2.connect().then((data) => {
    // Change schmoopiie to your username (not your bot as you can't whisper to yourself)
    client2.whisper("MuteBard", "I am Alive Too");
}).catch((err) => {
    console.log(err);
});

// Send a whisper to your bot to trigger this event..
client2.on("whisper", function (user, message) {
    console.log(user);
    console.log(message);
});
