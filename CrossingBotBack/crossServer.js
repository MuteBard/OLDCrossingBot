const express = require('express');
const cors = require('cors');
const Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise
});
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const tmi = require('tmi.js');
const secret = require('./secret/sealed');
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
  db.none(`DELETE FROM ecosystem`)
    .then(() => {
      crossbase.getByMonth(recievedData => {
        recievedData.forEach(elem => {
          db.none(`
              INSERT INTO ecosystem (ida ,species, name, bells, months, rarity)
              VALUES ($1,$2,$3,$4,$5,$6)`,
              [elem.ida, elem.species, elem.name, elem.bells, elem.months, elem.rarity])
          })
      })
  })
    .then(() => cb(`ECOSYSTEM ${crossbase.monthChar}`))
}

Database.prototype.joinGame = function(person){
  db.none(`
      INSERT INTO viewer (username, net, pole, level, nextlevel, totalexp, expnextlevel, bells, turnips)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [person, 1, 1, 0, 1, 1000, 1414, 0, 0])
    .then(() => {
      client.action(`mutebard`, `Welcome ${person}! you have joined the town VoHiYo  `)
      console.log(`${person} ADDED`)
    })
    .catch((err) =>{
      console.log(err)
      client.action(`mutebard`, `you are already in the town ${person}!`)
      console.log(`${person} DUPLICATE REJECTED`)
    })
}

Database.prototype.addPocket = function(person, rare, species){
  db.any(`SELECT * FROM ECOSYSTEM WHERE rarity = $1 AND species = $2`, [rare, species])
    .then(data => {
       var itemIndex = selectItem(data.length)
       console.log(data[itemIndex])
       return data[itemIndex]
  }).then( data => {
     db.none(`INSERT INTO pockets (username, aid)
              VALUES ($1, $2)`,
              [person, data.ida])
     return data
  }).then(data => {
     client.action(`mutebard`, `${person} you have caught a ${data.species}, the ${data.name}`)
     console.log(`${person} ${data.name} POCKETED`)
  });
}

Database.prototype.updateEXP = function(person, bells){
  db.any(`SELECT * FROM viewer WHERE username = $1`, [person])
  .then(data => {
    var expData = expCrunch(bells, data[0].totalexp)
    db.any(`UPDATE viewer SET level = $1, nextlevel = $2, totalexp = $3, expnextlevel = $4 WHERE username = $5`,
            [expData.newLevel, expData.nextLevel, expData.total, expData.remaining, person])
  })
  .catch(err => console.log(err))
}

Database.prototype.sellPocket = function(person){
  console.log(person)
  db.any(`
    SELECT bells FROM viewer WHERE username = $1
    UNION ALL
    SELECT SUM(ecosystem.bells) FROM pockets LEFT OUTER JOIN ecosystem ON ecosystem.ida = pockets.aid WHERE username = $1`, [person])
  .then(data => {
      client.action(`mutebard`, `${person} you have gained ${data[1].bells} bells`)
      var total = Number(data[0].bells) + Number(data[1].bells)
      console.log(`${person} ${data[1].bells} GAINED`)
      db.none(`UPDATE viewer SET bells = $1 WHERE username = $2`, [total, person])
      db.none(`DELETE FROM pockets WHERE username = $1`, [person])
      return total
    })
  .then((bells) => {
    console.log(Number.isInteger(bells))
    crossbase.updateEXP(person, bells)
    console.log(`${person} POCKETS ALL DELETED`)
  })
  .catch(err => console.log(err))
};



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

function expCrunch(bells, totalExp){
  var exp = expGain(bells)
  var newLevel = expToLevel(exp + totalExp)
  return {
    aquired : expGain(bells),
    total : (exp + totalExp),
    nextLevel : Math.floor(newLevel + 1),
    newLevel : Math.floor(newLevel),
    remaining : Math.ceil(ExpRemain(newLevel, Math.floor(newLevel + 1)))
  }
}




//update to total experiences
function expGain(bells){
  exp = bells / 10
  return Math.floor(exp)
}

//return the difference between two levels
function ExpRemain(level, levelNext){

  var expAtLevel = (Math.sqrt(Math.pow(2,level)) * 1000)
  var expAtLevelNext = (Math.sqrt(Math.pow(2,levelNext)) * 1000)
  return (expAtLevelNext - expAtLevel)
}

//Take in exp and return a level
function expToLevel(exp){
  var level = Math.log2(Math.pow((exp/ 1000),2))
  return level
}
//
crossbase = new Database()
crossbase.setMonth(7); //Jan = 0, Feb = 1 ..... Dec = 11
crossbase.setEcoSystem(function cb(recievedData){console.log(recievedData)});

client.on('chat', (channel, username, message, self) => {
  var person = username["display-name"]
  // console.log(`${person} PONG`)
  // client.action(`mutebard`, `${person} PONG`)

  if(message == "!start"){
    crossbase.joinGame(person)
  }
  else if(message == "!use-bugnet" || message == "!use-fishpole"){
    var person = username["display-name"]
    var rare = selectRarity()
    var species = selectSpecies(message)
    crossbase.addPocket(person, rare, species)
  }
  else if(message == "!sell-all"){
    crossbase.sellPocket(person)
  }
});

app.get('/api/all',(req, resp, next) => {
  db.any(`SELECT * FROM viewer`)
    .then(data => resp.json(data))
    .catch(next)
})

app.listen(4000, () => console.log('Listening on 4000'))
// //
// // // // //Whispers
// // // // client2.connect().then((data) => {
// // // //     client2.whisper("MuteBard", "I am Alive Too");
// // // // }).catch((err) => {
// // // //     console.log(err);
// // // // });
// // // //
// // // // // Send a whisper to your bot to trigger this event..
// // // // // client2.on("whisper", function (user, message) {
// // // // //     console.log(user);
// // // // //     console.log(message);
// // // // // });
// // //
// // //
// // //
// // // //take in their current level
// // // //take in their current exp
// // //
// // // //check their exp to the next level
// // // //add a next level column
// // //
// // // //subtract current experience by the amount needed to reach the next level
// // //
// // // //update viewer table to view total experience, experience to next level and the next level
// //
// // // LEVEL : 1  EXP : 1414
// // // LEVEL : 2  EXP : 2000
// // // LEVEL : 3  EXP : 2828
// // // LEVEL : 4  EXP : 4000
// // // LEVEL : 5  EXP : 5656
// // // LEVEL : 6  EXP : 8000
// // // LEVEL : 7  EXP : 11313
// // // LEVEL : 8  EXP : 16000
// // // LEVEL : 9  EXP : 22627
// // // LEVEL : 10  EXP : 32000
// // // LEVEL : 11  EXP : 45254
// // // LEVEL : 12  EXP : 64000
// // // LEVEL : 13  EXP : 90509
// // // LEVEL : 14  EXP : 128000
// // // LEVEL : 15  EXP : 181019
// // // LEVEL : 16  EXP : 256000
// // // LEVEL : 17  EXP : 362038
// // // LEVEL : 18  EXP : 512000
// // // LEVEL : 19  EXP : 724077
// // // LEVEL : 20  EXP : 1024000
// // // LEVEL : 21  EXP : 1448154
// // // LEVEL : 22  EXP : 2048000
// // // LEVEL : 23  EXP : 2896309
// // // LEVEL : 24  EXP : 4096000
// // // LEVEL : 25  EXP : 5792618
// // // LEVEL : 26  EXP : 8192000
// // // LEVEL : 27  EXP : 11585237
// // // LEVEL : 28  EXP : 16384000
// // // LEVEL : 29  EXP : 23170475
// // // LEVEL : 30  EXP : 32768000
//
// UPDATE company SET worth = CASE WHEN postal IN ('02026', '02933') THEN 34555 ELSE 4500 END

// // // db.any(`SELECT sum(X) FROM (
// // //   SELECT bells AS X FROM viewer WHERE username = $1
// // //   UNION ALL
// // //   SELECT SUM(ecosystem.bells) AS X FROM pockets LEFT OUTER JOIN ecosystem ON ecosystem.ida = pockets.aid WHERE username = $1) AS Y`, [person])
// //
// //
// // `          INSERT INTO postmessages (title , message)
// //           VALUES ($1,$2)`,
// //           [elem.ida, elem.species,])`

// console.log(`
//   Function : ExpRemain
//   INPUT
//   level : ${level}
//   levelNext : ${levelNext}
//
//   OUTPUT
//   Remaining Exp : ${expAtLevelNext - expAtLevel}
//   `)

// console.log(`
//   Function : expToLevel
//   INPUT
//   exp : ${exp}
//
//   MIDDLE COMPUTATIONS
//   exp : ${exp}
//   exp / 1000 : ${exp/1000}
//   Math.pow((exp/ 1000)) : ${Math.pow((exp/1000),2)  }
//   level : ${Math.log2(Math.pow((exp/ 1000),2))}
//
//   OUTPUT
//   level : ${level}
//   `)
