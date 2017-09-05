let BASEURL = 'http://localhost:4000';
if (window.location.hostname !== 'localhost'){
  BASEURL = '';
}

export default BASEURL;
