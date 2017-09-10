const INITAL_STATE = {
  origusers: [],
  users: [],
  cond : false,
  text : ""
};

export default function reducer(state = INITAL_STATE, action){

  if(action.type === "text"){
      return Object.assign({},state, {
          text:action.value
      })
  }

  else if(action.type === "clear"){
      return Object.assign({},state, {
          text:"",
          users: state.origusers
      })
  }

  else if(action.type === "searched"){
    let data = action.value
    return Object.assign({}, state, {
      users: data
    });
  }

  else if(action.type === "mount_all"){
    let data = action.value
    return Object.assign({}, state, {
      users: data,
      origusers:data
    });
  }
  return state;
}
