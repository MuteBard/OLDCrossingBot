import $ from 'jquery';
import BASEURL from '../baseurl';

export function getUser(username){
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/getUser/`,
        data: JSON.stringify({
          user: username,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          console.log(data)
          return dispatch({
            type: 'getuser',
            value : data
          })
        });
  }
  return asyncAction;
}

export function addTable(data){
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/addtable/`,
        data: JSON.stringify({
          user: data,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          return dispatch({
            type: 'addbase',
            value : data
          })
        });
  }
  return asyncAction;
}

export function getTables(data){
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/gettables/`,
        data: JSON.stringify({
          user: data,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          return dispatch({
            type: 'addbase',
            value : data
          })
        });
  }
  return asyncAction;
}
