const express = require('express');
const cors = require('cors');
const Promise = require('bluebird');
const request = require('request');
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
  channels: ["MidnightFreeze","MuteBard"]
};
var publ = new tmi.client(options);
var priv = new tmi.client(options);
publ.connect()

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
              INSERT INTO ecosystem (ida ,species, name, ebells, months, rarity, eimage)
              VALUES ($1,$2,$3,$4,$5,$6,$7)`,
              [elem.ida, elem.species, elem.name, elem.abells, elem.months, elem.rarity, elem.aimage])
          })
      })
  })
    .then(() => cb(`ECOSYSTEM ${crossbase.monthChar}`))
}

Database.prototype.joinGame = function(person){
  db.none(`
      INSERT INTO viewer (username, net, pole, level, nextlevel, totalexp, expnextlevel, vbells, turnips, netexp, poleexp, vimage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [person, 1, 1, 0, 1, 1000, 1414, 0, 0, 0, 0, null])
    .then(() => {
      whispering(person,`Welcome ${person}! you have joined the town VoHiYo`)
      console.log(`${person} ADDED`)
  })
  .then(() => {
    var options2 = {
      url:`https://api.twitch.tv/helix/users?login=${person}`,
      method:'GET',
      headers:{'Client-ID': '2vnc16bhkw59djckt61f7odsk424rh',
                'Accept' : 'application/vnd.twitchtv.v5+json'},
      sucesss: (data) => (data)
    }
      request(options2, (error, response, body) => {
        let info = JSON.parse(body)
        let avatar = info.data[0].profile_image_url
        db.none(`UPDATE viewer SET vimage = $1 WHERE username = $2`,[avatar, person])
      })
  })
    .catch((err) =>{
      console.log(err)
      whispering(person,`you are already in the town ${person}!`)
      // console.log(`${person} DUPLICATE REJECTED`)
  })
}

Database.prototype.addPocket = function(person, vid, rare, species){
  db.any(`SELECT * FROM ECOSYSTEM WHERE rarity = $1 AND species = $2`, [rare, species])
    .then(data => {
      var itemIndex = selectItem(data.length)
      let newExp = toolEXP(rare)
      if(species === 'bug') db.none(`UPDATE viewer SET netexp = netexp + $1 WHERE username = $2`, [newExp, person])
      else db.none(`UPDATE viewer SET poleexp = poleexp + $1 WHERE username = $2`,[newExp, person])
      return data[itemIndex]
  }).then(data => {
      db.none(`INSERT INTO pockets (vid, username, aid, record)
            VALUES ($1, $2, $3, LOCALTIMESTAMP)`,
            [vid, person, data.ida])
      return data
  }).then((data) => {
      whispering(person,`${person} you have caught a ${data.species}, the ${data.name}`)
  }).catch(err => console.log(err))

  db.any(`SELECT netexp, poleexp FROM viewer WHERE username = $1` , [person])
    .then(exp => {
      level = (species === 'bug' ? toolLevelUp(exp[0].netexp) : toolLevelUp(exp[0].poleexp))
      if(species === 'bug') db.any(`UPDATE viewer SET net = $1 WHERE username = $2`,[level, person])
      else db.any(`UPDATE viewer SET pole = $1 WHERE username = $2`,[level,person])
  }).catch(err => console.log(err))
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
    SELECT vbells FROM viewer WHERE username = $1
    UNION ALL
    SELECT SUM(ecosystem.ebells) FROM pockets LEFT OUTER JOIN ecosystem ON ecosystem.ida = pockets.aid WHERE username = $1`, [person])
  .then(data => {
      whispering(person,`${person} you have gained ${data[1].vbells} bells`)
      var total = Number(data[0].vbells) + Number(data[1].vbells)
      console.log(`${person} ${data[1].vbells} GAINED`)
      db.none(`UPDATE viewer SET vbells = $1 WHERE username = $2`, [total, person])
      return total
    })
  .then((bells) => {
    console.log(Number.isInteger(bells))
    crossbase.updateEXP(person, bells)
  })
  .then(() => db.none(`DELETE FROM pockets WHERE username = $1`, [person]))
  .catch(err => console.log(err))
};

Database.prototype.buyTurnips = function(person, n ){
  db.any(`SELECT vbells FROM viewer WHERE username = $1`, [person])
    .then(data => {
      bells = data[0].vbells
      return bells
    })
    .then(bells => {
      return[bells,db.any(`SELECT tbells FROM stalkstats WHERE id = (SELECT MAX(id) FROM stalkstats)`)]
    })
    .spread((bells,data) => {
      let turnip = data[0].tbells
      max_n = bells / turnip
      if (max_n < n) n = max_n
      db.any(`UPDATE viewer SET vbells = vbells - $1 WHERE username = $2`, [(n * turnip), person])
      return turnip
    })
    .then(t => {
      db.any(`UPDATE viewer SET turnips = $1 WHERE username = $2`, [n, person])
      return t
    })
    .then(t => {
       whispering(person,`${person} Bought ${n} turnips for ${n*t}.`)
    })
}

Database.prototype.sellTurnips = function(person, n){
  db.any(`SELECT vbells,turnips FROM viewer WHERE username = $1`, [person])
    .then(data => {
      bells = data[0].vbells
      turnips_owned = data[0].turnips
      return [bells, turnips_owned]
    })
    .then((bells, turnips_owned) => {
      return[bells,turnips_owned,db.any(`SELECT tbells FROM stalkstats WHERE id = (SELECT MAX(id) FROM stalkstats)`)]
    })
    .spread((bells, turnips_owned, data) => {
      let turnip_price = data[0].tbells
      if (n > turnips_owned) n = turnips_owned
      db.any(`UPDATE viewer SET vbells = vbells + $1 WHERE username = $2`, [(n * turnip_price), person])
      return turnip_price
    })
    .then((t) => {
      db.any(`UPDATE viewer SET turnips = 0 WHERE username = $1`, [person])
      return t
    })
    .then((t) => {
        whispering(person,`${person} Bought ${n} turnips for ${n*t}`)
    })
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

function toolEXP(rare){
  if (rare === 5)     return 5*20
  else if(rare === 4) return 4*10
  else if(rare === 3) return 3*5
  else if(rare === 2) return 2*2
  else                return 1
}

function toolLevelUp(exp){
  if (exp >= 100000)    return 5
  else if(exp >= 10000) return 4
  else if(exp >= 1000)  return 3
  else if(exp >= 150)   return 2
  else                  return 1
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

function getNumber(str,num){
  let value = 0
  let string = str.slice(num).trim()
  if (!isNaN(string)){
    value = Number(string)
  }
  return value
}

var values = {
  a:{
    max: 21,
    min: 11
  },
  b:{
    max: 10,
    min: 5
  },
  c:{
    max: 91,
    min: 54
  },
  d:{
    max: 35,
    min: 21
  }
}
function randomChanges(){
  let array = Array(14).fill(null)
  return array.map(elem => {
    change = String.fromCharCode(Math.floor((Math.random() * 4 + 97)))
    return change
  })
}
function choosePattern(){
  let arr
  let max
  let choosePattern = Math.floor((Math.random() * 4 + 1))
  if(choosePattern == 1){
    arr = randomChanges()
    max = 200
  }
  else if (choosePattern == 2){
    arr = Array(14).fill('b')
    max = 101
  }
  else if (choosePattern == 3){
    arr = ['b','b','a','c','b','b','a','c','b','b','a','c','b','d']
    max = 500
  }
  else if (choosePattern == 4){
   arr = ['b','d','c','c','c','d','c','c','c','d','c','c','c','d']
   max = 600
 }
  db.any(`INSERT INTO stalkstats (tbells, net, session, pattern, max, changetime)
         VALUES ($1, NULL, $2, $3, $4, LOCALTIMESTAMP)`,
         [100, 0,'-'+(arr).join(""), max])
}
function stalkChange(price, letter, values){
  let num
  if(letter == 'a')      num = values.a
  else if(letter == 'b') num = values.b
  else if(letter == 'c') num = values.c
  else if(letter == 'd') num = values.d
  let adj = Math.floor((Math.random() * (num.max - num.min + 1)) + num.min)
  let result = (letter == 'a' || letter == 'c' ? (price + adj) : (price - adj))
  return result
}
function stalkMarket(){
  db.any(`SELECT * FROM stalkstats WHERE id = (SELECT MAX(id) FROM stalkstats)`)
    .then(data => {
      if(data[0] == undefined){
        choosePattern()
        stalkMarket()
      }
      else if((data[0].session + 1) > 14){
        choosePattern()
      }
      else{
        let turnipCost = data[0].tbells
        let nextSession = data[0].session + 1
        let pattern = data[0].pattern
        let letter = pattern.charAt(nextSession)
        let newTurnipCost = stalkChange(turnipCost, letter, values)
        newTurnipCost = (newTurnipCost >= data[0].max ? (data[0].max) : (newTurnipCost <= 10 ? 10 : newTurnipCost))
        let net = (newTurnipCost - turnipCost)
        db.any(`INSERT INTO stalkstats (tbells, net, session, pattern, max, changetime)
                VALUES ($1, $2, $3, $4, $5, LOCALTIMESTAMP)`,
                [newTurnipCost, net, nextSession, pattern, data[0].max])
        }
     })
  }
function initMarket(){
  setInterval(() => {
    stalkMarket()
  }, 10000);
}
// 43200000
initMarket()

function whispering(viewer, message){
  priv.connect().then(() => {
        priv.whisper(viewer, message);
    }).catch((err) => {
        console.log(err);
    });
}

crossbase = new Database()
crossbase.setMonth(9); //use date time to set date
crossbase.setEcoSystem(function cb(recievedData){console.log(recievedData)});


publ.on('chat', (channel, userstate, message, self) => {
  var viewer = userstate["display-name"]
  var streamer = channel.slice(1)

  if(message == "!help"){
    whispering(viewer,`Hey ${viewer} for more information on how CrossingBot works, visit http://localhost:3000/`)
  }

  else if(message == "!start"){
    crossbase.joinGame(viewer)
  }
  else if(message == "!use-bugnet" || message == "!use-fishpole"){
    var rare = selectRarity()
    var species = selectSpecies(message)
    db.any(`SELECT id FROM viewer WHERE username = $1`,[viewer])
      .then(data => crossbase.addPocket(viewer,data[0].id,rare,species))
  }
  else if(message == "!show-all"){
    db.any(`SELECT name FROM
                (SELECT * FROM pockets AS p
                LEFT OUTER JOIN ecosystem AS e
                ON e.ida = p.aid)x
             WHERE username = $1`, [viewer])
      .then(data =>{
          let bugs = (data.map(elem => elem.name)).join(", ")
          whispering(viewer,bugs)
        })
  }

  else if(message == "!sell-all"){
    crossbase.sellPocket(viewer)
  }

  else if(message == "!mybells"){
    db.any(`SELECT vbells FROM viewer WHERE username = $1`,[viewer])
      .then(data => whispering(viewer,`${viewer} you have ${data[0].vbells} bells`))
  }

  else if(message == "!myturnips"){
    db.any(`SELECT turnips FROM viewer WHERE username = $1`,[viewer])
      .then(data => whispering(viewer,`${viewer} you have ${data[0].turnips} turnips`))
  }

  else if(message == "!price-t"){
    db.any(`SELECT tbells FROM stalkstats WHERE id = (SELECT MAX(id) FROM stalkstats)`)
      .then(data => whispering(viewer,`${viewer} the market price for turnips are ${data[0].tbells} bells`))
  }
  else if(message.includes("!buy-t")){
    let num = getNumber(message,6)
    crossbase.buyTurnips(viewer, num)
  }

  else if(message.includes("!sell-t")){
    let num = getNumber(message,7)
    crossbase.sellTurnips(viewer, num)
  }
});

app.get('/api/all',(req, resp, next) => {
  db.any(`SELECT * FROM viewer`)
    .then(data => resp.json(data))
    .catch(next)
})

app.post('/api/viewer', (req, resp, next) => {
  let query = req.body.find;
  console.log(query)
  db.any(`SELECT * FROM viewer WHERE username ilike $1`,"%"+query+"%")
  .then(data => resp.json(data))
  .catch(next)
});

app.post('/api/pocket/:id', (req, resp, next) =>{
  let id = req.body.id
  db.any(`SELECT * FROM
            (SELECT * FROM pockets AS p
            LEFT OUTER JOIN ecosystem AS e ON e.ida = p.aid
            LEFT OUTER JOIN viewer AS v ON v.username = p.username)x
          WHERE vid = $1`,[id])
  .then(data =>{
    console.log(data)
    resp.json(data)
  })
  .catch(next)
})

app.get('/api/stalks', (req, resp, next) => {
  db.any(`SELECT * FROM stalkstats ORDER BY id DESC LIMIT 14`)
    .then(data => resp.json(data))
    .catch(next)
})

app.listen(4000, () => console.log('Listening on 4000'))

// // LEVEL : 1  EXP : 1414
// // LEVEL : 2  EXP : 2000
// // LEVEL : 3  EXP : 2828
// // LEVEL : 4  EXP : 4000
// // LEVEL : 5  EXP : 5656
// // LEVEL : 6  EXP : 8000
// // LEVEL : 7  EXP : 11313
// // LEVEL : 8  EXP : 16000
// // LEVEL : 9  EXP : 22627
// // LEVEL : 10  EXP : 32000
// // LEVEL : 11  EXP : 45254
// // LEVEL : 12  EXP : 64000
// // LEVEL : 13  EXP : 90509
// // LEVEL : 14  EXP : 128000
// // LEVEL : 15  EXP : 181019
// // LEVEL : 16  EXP : 256000
// // LEVEL : 17  EXP : 362038
// // LEVEL : 18  EXP : 512000
// // LEVEL : 19  EXP : 724077
// // LEVEL : 20  EXP : 1024000
// // LEVEL : 21  EXP : 1448154
// // LEVEL : 22  EXP : 2048000
// // LEVEL : 23  EXP : 2896309
// // LEVEL : 24  EXP : 4096000
// // LEVEL : 25  EXP : 5792618
// // LEVEL : 26  EXP : 8192000
// // LEVEL : 27  EXP : 11585237
// // LEVEL : 28  EXP : 16384000
// // LEVEL : 29  EXP : 23170475
// // LEVEL : 30  EXP : 32768000
