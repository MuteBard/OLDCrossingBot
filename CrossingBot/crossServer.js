const tmi = require('tmi.js');
const secret = require('./secret/sealed');
const Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise
});
const db = pgp(secret)
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
    password: secret.oauth
  },
  channels: ["MidnightFreeze", "MuteBard"]
};

var client = new tmi.client(options);
var client2 = new tmi.client(options);
client.connect()

function Database(){
  this.monthNumber = -1;
  this.monthChar = "";
}
Database.prototype.setMonth = function(number){
  crossbase.monthNumber = number;
}
Database.prototype.setAnimals = function(cb){
  db.any(`select * from animal`)
    .then(data => {
      cb(data)
    })
}
Database.prototype.getByMonth = function(cb){
  var monthList = "ABCDEFGHIJKL".split('');
  crossbase.monthChar = monthList[this.monthNumber];
  crossbase.setAnimals(recievedData => {
    animalsOfMonth = recievedData.filter(elem => {
      return elem.months.indexOf(crossbase.monthChar) > -1
    });
    cb(animalsOfMonth)
  });
}
Database.prototype.setEcoSystem = function(cb){
  crossbase.getByMonth(recievedData => {
    db.none(`DELETE FROM ecosystem`)
    recievedData.forEach(elem => {
      db.none(`
          INSERT INTO ecosystem (species, name, bells, months, rarity)
          VALUES ($1,$2,$3,$4,$5)`,
          [elem.species, elem.name, elem.bells, elem.months, elem.rarity])
      })
    cb(`ECOSYSTEM ${crossbase.monthChar}`)
  })
}

function selectRarity(){
  var num = Math.floor((Math.random() * 100) + 1);
  if(num % 30 == 0)      return 5
  else if(num % 11 == 0) return 4
  else if(num % 6 == 0)  return 3
  else if(num % 3 == 0)  return 2
  else                   return 1
}

crossbase = new Database()
crossbase.setMonth(7)
crossbase.setEcoSystem(function cb(recievedData){console.log(recievedData)});

//
// // Database.prototype.addPocket = function(cb){
// //   var person = "MuteBard"
// //   db.any(`select * from ecosystem where rarity = $1`, selectRarity())
// //     .then(data => (Math.floor((Math.random() * data.length) + 1))
// //     .then(selected => )
// //     })
// // }
//
//
//
// // client.on('join', (channel,username) => console.log(username))
//
client.on('chat', (channel, username, message, self) => {
  console.log("DATABASE INSERTION START A")
  if(message == "!start"){
    console.log("DATABASE INSERTION  B")
    db.none(`
        INSERT INTO viewer (username, net, pole, level, bells, turnips)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [username["display-name"],1, 1, 1, 0, 0])
    }
  console.log("DATABASE INSERTION START C")
  client.action(`${username["display-name"]}`, `Welcome ${username["display-name"]}! you have joined the town VoHiYo  `)
  console.log(`${username["display-name"]}`)
});
//
//
// //Whispers
// client2.connect().then((data) => {
//     client2.whisper("MuteBard", "I am Alive Too");
// }).catch((err) => {
//     console.log(err);
// });
//
// // Send a whisper to your bot to trigger this event..
// // client2.on("whisper", function (user, message) {
// //     console.log(user);
// //     console.log(message);
// // });
