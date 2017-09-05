const INITAL_STATE = {
  users: [],
  cond : false
};

export default function reducer(state = INITAL_STATE, action){
  if(action.type === "mount_all"){
    let data = action.value
    // let tempusers = action.value;
    return Object.assign({}, state, {
      users: data
    });
  }
  return state;
}
