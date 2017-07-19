// const tmi = require('tmi.js');
const secret = require('./secret/sealed');
const Promise = require('bluebird');
const pgp = require('pg-promise')({
  promiseLib: Promise
});
const db = pgp(secret)


function Database(){
  this.monthNumber = -1;
}
// Database.prototype.setMonth(){}
//be sure to promisify the inserts


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
  var monthChar = monthList[this.monthNumber];
  crossbase.setAnimals(recievedData => {
    animalsOfMonth = recievedData.filter(elem => {
      return elem.months.indexOf(monthChar) > -1
    });
    cb(animalsOfMonth)
    // console.log(animalsOfMonth)
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
    cb(`ECOSYSTEM ${crossbase.monthNumber}`)
  })
}

Database.prototype.addItem = function(cb){


}



crossbase = new Database()
crossbase.setMonth(7)
crossbase.setEcoSystem(function cb(recievedData){
  console.log(recievedData)
});
// var thing = crossbase.setAnimals(function cb(recievedData){
//   console.log(recievedData);
// })


// console.log(crossbase.animals)
// console.log("test2")
// function something(cb) {
//   $.ajax({
//     url: `${ROOT}&${API_KEY}&language=en-US`,
//     method: ‘GET’
//   })
//   .then(function receiveData(data) {
//     cb(data)
//   })
//   .catch(function(e) {
//     console.log(e.name)
//   })
// }



// let randomData = something((data) => {
//   console.log(data)
// })
//
// console.log(randomData)

// DataBase Queries:
//
// 	Website:
//
//
// 	Twitch:
//
// 			Chat:
// 				-Have ppl pull up their individual turnip timer
// 				-Have ppl pull up how much money they have
// 				-Have ppl pull up how much turnips they have
// 				-Have ppl pull up the status of their net
// 				-Have ppl pull up the status of their pole
// 				-Give ppl the ability to buy turnips
// 				-Give ppl have the ability to sell their stuff
//
//
//
// 			Whisper:
// 				-Have ppl pull up what is in their entire pocket + net + poll + turnips




//
// var options = {
//   options : {
//     debug : true
//   },
//   connection: {
//     cluster: "aws",
//     reconnect: true
//   },
//   identity: {
//     username: "CrossingBot",
//     password: secret.oauth
//   },
//   channels: ["MidnightFreeze", "MuteBard"]
// };
//
// var client = new tmi.client(options);
// var client2 = new tmi.client(options);
//
// //General Chat
// client.connect()
// client.on('join', (channel,username) => console.log(username))
// client.on('chat', (channel, username, message, self) =>{
//   if(message.charAt(0) == "!"){
//     client.action("MuteBard", `${username["display-name"]} Hello!`)
//   }
// })
// client.on('connected', (address, port) => client.action("MuteBard", "NotLikeThis"));
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
