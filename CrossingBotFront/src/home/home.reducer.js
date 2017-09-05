const INITAL_STATE = {
  open : false,
  st_username : "",
  st_fname: "",
  st_lname: "",
  st_password : "",
  st_password2: "",
  passMatch : false,
  newUser : false,
  id : null
};

export default function reducer(state = INITAL_STATE, action){

  if(action.type === "open"){
    return Object.assign({}, state, {
      open : true
    })
  }

  else if (action.type === "username"){
    let temp_passmatch = false;
    if(state.st_password !== state.st_password2 || state.fname === null || state.lname === null || state.username === null){
      temp_passmatch = false;
    }
    return Object.assign({}, state, {
      st_username : action.value.toLowerCase(),
      passMatch : temp_passmatch
    })
  }
  else if (action.type === "password"){
    let temp_p1 = action.value
    let temp_p2 = state.st_password2
    let temp_passmatch = false;

    if(temp_p1 === temp_p2 && state.fname !== null && state.lname !== null && state.username !== null){
      temp_passmatch = true;
    }

    return Object.assign({}, state, {
      st_password : action.value,
        passMatch : temp_passmatch
    })
  }

  else if (action.type === "password2"){
    let temp_p1 = state.st_password
    let temp_p2 = action.value
    let temp_passmatch = false;

    if(temp_p1 === temp_p2 && state.fname !== null && state.lname !== null && state.username !== null){
      temp_passmatch = true;
    }
    return Object.assign({}, state, {
      st_password2 : action.value,
      passMatch : temp_passmatch
    })
  }

  else if(action.type === "new"){
    return Object.assign({}, state = INITAL_STATE, {
      newUser : true,
      open : true

    })
  }

  else if(action.type === "old"){
    return Object.assign({}, state = INITAL_STATE, {
      newUser : false,
      open : true
    })
  }

  else if(action.type === "fname"){
    let temp_passmatch = false;
    if(state.st_password !== state.st_password2 || state.fname === null || state.lname === null || state.username === null){
      temp_passmatch = false;
    }
    return Object.assign({}, state, {
      st_fname : action.value.toLowerCase(),
      passMatch : temp_passmatch
    })
  }

  else if(action.type === "lname"){
    let temp_passmatch = false;
    if(state.st_password !== state.st_password2 || state.fname === null || state.lname === null || state.username === null){
      temp_passmatch = false;
    }
    return Object.assign({}, state, {
      st_lname : action.value.toLowerCase(),
      passMatch : temp_passmatch
    })
  }

  else if(action.type === "submitted"){
    return Object.assign({}, state, {
      id : action.value
    })
  }



  return state;
}
