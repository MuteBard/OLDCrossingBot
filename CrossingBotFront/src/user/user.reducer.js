const INITAL_STATE = {
  username: "",
  image: "",
  pocket: []
};

export default function reducer(state = INITAL_STATE, action){

  if(action.type === "pocket"){
    let array = action.value
     let tempUsername = array[0].username
     let tempImage = array[0].vimage
     console.log(array)

    return Object.assign({}, state, {
      username: tempUsername,
      image: tempImage,
      pocket : array
    });
  }

  if (action.type === "set"){
    let array = action.array
    let id = action.id

    for(let i = 0; i < array.length; i++){
      if(array[i].username === id){
        return Object.assign({}, state, {
          viewer: array[i]
        });
      }
    }
  }


  return state
}
