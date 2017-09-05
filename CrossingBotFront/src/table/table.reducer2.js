const INITAL_STATE = {
  keysvalues : [],
  companies: [],
  editMode: false,
  saveState: false,
  editBText: 'Edit',
  savedEdits: [],
  username:"",
  tableid:"",
  exists:false
};

export default function reducer(state = INITAL_STATE, action){
  if(action.type === "getAll"){
    let companyObjs = action.value;
    return Object.assign({}, state, {
      companies: companyObjs,
      keysvalues : Object.keys(companyObjs[0])
    });
  }

  else if(action.type === "settable"){
    let table = action.value[0]
    return Object.assign({}, state, {
      username: table.username,
      tableid: table.tableid,
      exists: table.exist
    });
  }


  else if(action.type === "createTable"){
    return Object.assign({}, state, {
      exists: true
    });
  }


  else if(action.type === 'edit' || action.type === 'save'){
    let temp_editMode = state.editMode === false ? true : false;
    let temp_editBText = temp_editMode === true ? "Cancel" : "Edit";
    if (action.type === 'save'){
      var temp_saveState = true;
    }
    return Object.assign({}, state, {
      editMode: temp_editMode,
      editBText: temp_editBText,
      saveState: temp_saveState
    });
  }

  else if (action.type === 'revertsave'){
    let temp_saveState = false;
    return Object.assign({}, state, {
      saveState: temp_saveState
    });
  }

  else if(action.type === 'textchange'){
    let key = action.key
    let index = action.idx
    let data = action.text
    //make copies
    let temp_companies = state.companies.slice();
    let temp_savedEdits = state.savedEdits.slice();
    //edit the state's version of the database info
    temp_companies[index][key] = data;
    //keep note of the location of this edit and its value
    let edit = {key:key,
                index:index,
                data:data
                }
    //push this edit location+value into a list of past edits
    let editSize = temp_savedEdits.length
    //because edits are being noted whenever there is a change in text, we only would like to push into the array an edit
    //only if it was the last edit within that cell
    console.log(temp_savedEdits)
    if (editSize > 0 && temp_savedEdits[editSize-1].key === edit.key && temp_savedEdits[editSize-1].index === edit.index ){
      temp_savedEdits.pop()
      temp_savedEdits.push(edit)
    }else{
      temp_savedEdits.push(edit)
    }
    return Object.assign({}, state, {
      companies: temp_companies,
      savedEdits: temp_savedEdits
    });
  }

  //create an empty entry
  else if (action.type == 'add'){
    let temp_companies = state.companies.slice();
    let arrayKeys = state.keysvalues.slice();
    let entry = {}
    for (let i = 0 ; i < arrayKeys.length ; i++){
        //set the correct id based on the id of the previou entry and keep mind when company array is empty
        if (arrayKeys[i] == 'id'){
          (temp_companies.length > 0 ? entry[arrayKeys[i]] = temp_companies[temp_companies.length-1].id + 1 : entry[arrayKeys[i]] = 0 )
        }
        //set the correct idx based on the number of entrants and keep mind when company array is empty
        else if (arrayKeys[i] == 'idx'){
          (temp_companies.length > 0 ? entry[arrayKeys[i]] = temp_companies.length : entry[arrayKeys[i]] = 0 )
        }
        //everything else can be blank
        else{
          entry[arrayKeys[i]] = '';
        }
    }
    //add the empty entry to array of company objects
    temp_companies.push(entry)
    return Object.assign({}, state, {
      companies: temp_companies
    });
  }

  else if (action.type == 'delete'){
    let deleteAtIndex = action.value
    let temp_companies_half1 = state.companies.slice(0, deleteAtIndex )
    let temp_companies_half2 = state.companies.slice(deleteAtIndex,state.companies.length-1)
    let merged_temp_companies = temp_companies_half1.concat(temp_companies_half2)
    return Object.assign({}, state, {
      companies: merged_temp_companies
    });
  }

  return state;
}
