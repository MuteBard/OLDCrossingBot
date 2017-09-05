import $ from 'jquery';
import BASEURL from '../baseurl';

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

//
// export function getUser(tableid){
//   console.log("entered "+ tableid)
//   let asyncAction = function(dispatch){
//     $.ajax({
//         url : `${BASEURL}/api/getUserViaTid/`,
//         data: JSON.stringify({
//           tableid: tableid,
//         }),
//         method: 'post',
//         dataType: 'JSON',
//         contentType: 'application/json'
//     }).then((data) => {
//           console.log(data)
//           return dispatch({
//             type: 'settable',
//             value : data
//           })
//         });
//   }
//   return asyncAction;
// }
