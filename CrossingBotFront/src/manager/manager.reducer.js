const INITAL_STATE = {
  name: "",
  username: "",
  id: null,
  tables: []
};

export default function reducer(state = INITAL_STATE, action){
  if(action.type === "getuser"){
    return Object.assign({}, state, {
      username: action.value.username,
      name: action.value.name,
      id: action.value.id
    })
  }
  else if (action.type === "addbase"){
    return Object.assign({}, state, {
      tables: action.value
    })
  }
  return state;
}
