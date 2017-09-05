import $ from 'jquery';
import BASEURL from '../baseurl';

// export function getData() {
//   let asyncAction = function(dispatch) {
//     $.get(`${BASEURL}/api/all/`)
//      .then(data => dispatch({
//         type: 'mount_all',
//         value: data
//      }));
//   }
//   return asyncAction;
// }

export function getUser(tableid){
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/getUserViaTid/`,
        data: JSON.stringify({
          tableid: tableid,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          console.log('ESTABLISH')
          console.log('DONE 1')
          return dispatch({
            type: 'settable',
            value : data
          })
        });
  }
  return asyncAction;
}

export function createTable(table){
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/createTable/`,
        data: JSON.stringify({
          tableid: table,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          console.log('CREATED')
          console.log('DONE 2')
          return dispatch({
            type: 'createTable',
          })
        });
  }
  return asyncAction;
}

export function getData(table){
  let asyncAction = function(dispatch){
    $.ajax({
        url : `${BASEURL}/api/getAll/`,
        data: JSON.stringify({
          tableid: table,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          console.log(data)
          console.log('DONE 3')
          return dispatch({
            type: 'getAll',
            value : data
          })
        });
  }
  return asyncAction;
}


export function edit(){
  return{
    type: 'edit'
  };
}

export function del(idx){
  return{
    type: 'delete',
    value : idx
  };
}

export function add(){
  return{
    type: 'add'
  };
}

export function save(saved){
  let asyncAction = function(dispatch){
    $.ajax({
        url: `${BASEURL}/api/save/`,
        data: JSON.stringify({
          edits: saved,
        }),
        method: 'post',
        dataType: 'JSON',
        contentType: 'application/json'
    }).then((data) => {
          console.log(data)
          return dispatch({
            type: 'save'
          })
        });
  }
  return asyncAction;
}

export function revertSaveState(){
  return{
    type: 'revertsave'
  };
}

export function updateEdit(text, key, idx){
  return{
    type: "textchange",
    text: text,
    key: key,
    idx: idx
  };
}
