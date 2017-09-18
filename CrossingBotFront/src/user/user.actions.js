import $ from 'jquery';
import BASEURL from '../baseurl';

export function setUser(id, array){
  return{
    type: 'set',
    array: array,
    id: id
  }
}

export function getPocket(identifier){
  let asyncAction = function(dispatch){
    $.ajax({
      url: `${BASEURL}/api/pocket/:${identifier}`,
      data: JSON.stringify({
        id : identifier,
      }),
      method: 'post',
      dataType: 'JSON',
      contentType: 'application/json'
    }).then(data => dispatch({
      type:'pocket',
      value: data
    }))
  }
  return asyncAction;
}

export function getStalks() {
  let asyncAction = function(dispatch) {
    $.get(`${BASEURL}/api/stalks/`)
     .then(data => dispatch({
        type: 'stalk',
        value: data
     }));
  }
  return asyncAction;
}
