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
  db.any(`SELECT * FROM animal`)
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
          INSERT INTO ecosystem (ida ,species, name, bells, months, rarity)
          VALUES ($1,$2,$3,$4,$5,$6)`,
          [elem.ida, elem.species, elem.name, elem.bells, elem.months, elem.rarity])
      })
    cb(`ECOSYSTEM ${crossbase.monthChar}`)
  })
}

Database.prototype.joinGame = function(person, message){
  db.none(`
      INSERT INTO viewer (username, net, pole, level, bells, turnips)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [person,1, 1, 1, 0, 0])
    .then(() => {
      client.action(`${person}`, `Welcome ${person}! you have joined the town VoHiYo  `)
      console.log(`${person} ADDED`)
    })
    .catch(() =>{
      client.action(`${person}`, `you are already in the town ${person}!`)
      console.log(`${person} DUPLICATE REJECTED`)
    })
}

Database.prototype.addPocket = function(person, rare, species){
  db.any(`SELECT * FROM ECOSYSTEM WHERE rarity = $1 AND species = $2;`, [rare, species])
    .then(data => {
     var itemIndex = selectItem(data.length)
     console.log(itemIndex)
     return data[itemIndex]
  }).then( data => {
     db.none(`INSERT INTO pockets (username, aid)
              VALUES ($1, $2)`,
              [person, data.ida])
     console.log(`${person} NET USED`)
     return data
  }).then(data => {
     client.action(`${person}`, `${person} you have caught a ${data.species}, the ${data.name}`)
     console.log(`${person} ${data.name} POCKETED`)
  });
}

function selectSpecies(message){
  if(message.slice(5,6) == "b") return 'bug'
  else                          return 'fish'

}

function selectRarity(){
  var num = Math.floor((Math.random() * 100) + 1);
  if(num % 30 == 0)      return 5
  else if(num % 11 == 0) return 4
  else if(num % 6 == 0)  return 3
  else if(num % 3 == 0)  return 2
  else                   return 1
}

function selectItem(size){
  var num = Math.floor((Math.random() * size) + 1);
  return num
}


crossbase = new Database()
crossbase.setMonth(7); //Jan = 0, Feb = 1 ..... Dec = 11
crossbase.setEcoSystem(function cb(recievedData){console.log(recievedData)});

//Works but be sure to protect against duplicates later
client.on('chat', (channel, username, message, self) => {
  if(message == "!start"){
    var person = username["display-name"]
    crossbase.joinGame(person, message)
  }
});

//arrays are specialluzed for order
//dictionaries are optimized for searching
client.on('chat', (channel, username, message, self) => {
  if(message == "!use-bugnet" || message == "!use-fishpole"){
    var person = username["display-name"]
    var rare = selectRarity()
    var species = selectSpecies(message)
    crossbase.addPocket(person, rare, species)
  }
});

// SELECT * FROM ECOSYSTEM WHERE rarity = 2 AND species = "bug"


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
