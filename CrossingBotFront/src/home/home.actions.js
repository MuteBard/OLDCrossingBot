import $ from 'jquery';
import BASEURL from '../baseurl';

export function openLog(){
  return{
    type: 'open'
  };
}

export function submit(userinfo, group ){
  console.log(userinfo)
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/submitsignup/`,
        data: JSON.stringify({
          user: userinfo,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((id) => {
          return dispatch({
            type: 'submitted',
            value : id
          })
        });
  }
  return asyncAction;
}

export function username(text){
  return{
    type: 'username',
    value : text
  };
}

export function password(text){
  return{
    type: 'password',
    value : text
  };
}

export function password2(text){
  return{
    type: 'password2',
    value : text
  };
}


export function signUp(){
  return{
    type: 'new'
  }
}

export function logIn(){
  return{
    type: 'old'
  }
}

export function fname(name){
  return{
    type: 'fname',
    value: name
  }
}

export function lname(name){
  return{
    type: 'lname',
    value: name
  }
}
