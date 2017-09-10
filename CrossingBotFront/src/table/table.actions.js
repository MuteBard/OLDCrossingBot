import $ from 'jquery';
import BASEURL from '../baseurl';

export function updateText(text){
  return{
    type: "text",
    value: text
  };
}

export function clearText(){
  return{
    type: "clear",
  };
}

export function getData(){
  let asyncAction = function(dispatch) {
    $.get(`${BASEURL}/api/all/`)
     .then(data => dispatch({
        type: 'mount_all',
        value: data
     }));
  }
  return asyncAction;
}

export function updateSearch(query){
    let asyncAction = function(dispatch){
        dispatch(updateText(query))
        $.ajax({
            url: `${BASEURL}/api/viewer/`,
            data: JSON.stringify({
              find: query,
            }),
            method: 'post',
            dataType: 'JSON',
            contentType: 'application/json'
        }).then(data => dispatch({
            type:'searched',
            value:data,
        }))
    }
    return asyncAction;
}
