//stylesheet
import './index.css';
//standard react/redux imports
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import ReduxThunk from 'redux-thunk';

//Components
import Main from './main';

//Reducers
import tableReducer from './table/table.reducer';
import userReducer from './user/user.reducer';

//version 4 for react router
//https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf
import { BrowserRouter } from "react-router-dom";

//sum up all reducers into one reducer object
const reducer = Redux.combineReducers({
  table: tableReducer,
  user: userReducer
})

//create the store
const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  Redux.applyMiddleware(ReduxThunk)
);


//render components and give them access to the store
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
  </ReactRedux.Provider>,
  document.getElementById('root')
);

registerServiceWorker();
