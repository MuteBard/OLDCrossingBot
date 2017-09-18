const INITAL_STATE = {
  username: "",
  image: "",
  pocket: [],
  stalks : []
};

export default function reducer(state = INITAL_STATE, action){
  if(action.type === "pocket"){
    let array = action.value
    let tempUsername = array[0].username
    let tempImage = array[0].vimage


    let tempDict = {}
    let cleaned = []

    array.forEach(elem => {
      tempDict[elem.name] = {
        occur : 0,
        name : null,
        species: null,
        ebells : null,
        rarity : null,
        months : null,
        eimage : null
      }
    })

    array.forEach(elem =>{
      let critter = elem.name
      let critterList = Object.keys(tempDict)
      if(critterList.includes(critter)){
        tempDict[critter]['occur']++
        tempDict[critter]['name'] = critter
        tempDict[critter]['species'] = elem.species
        tempDict[critter]['ebells'] = elem.ebells
        tempDict[critter]['rarity'] = elem.rarity
        tempDict[critter]['months'] = elem.months
        tempDict[critter]['eimage'] = elem.eimage
      }
    })

    for (var critter in tempDict) {
      if (tempDict.hasOwnProperty(critter)) {
        cleaned.push(tempDict[critter]);
      }
    }
    console.log(cleaned)

    return Object.assign({}, state, {
      username: tempUsername,
      image: tempImage,
      pocket : cleaned
    });
  }

  else if(action.type === "stalk"){
    let temparray = []
    let temp = action.value
    console.log(action.value)
    temparray = temp.map(elem => temparray.push(elem))
    return Object.assign({}, state, {
      stalks: temparray
    });
  }
  return state
}
