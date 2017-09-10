const INITAL_STATE = {
  viewer: {}
};

export default function reducer(state = INITAL_STATE, action){
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

  else if(action.type === "pocket"){
    console.log(action.value)
  }
  return state
}
