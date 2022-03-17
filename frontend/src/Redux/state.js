import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

let initialState = {
  userId: localStorage.getItem('userId'),
  active: 'posts',
  loggedIn: {},
  viewData: {
    userId: ''
  },
  spinner: false,
}

function appReducer(state = initialState, action) {
  let stateCopy = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case "changeActive":
      stateCopy.active = action.payload;
      return stateCopy;

    case "userData":
      stateCopy.loggedIn = action.payload;
      return stateCopy;

    case "viewUser":
      stateCopy.viewData = action.payload;
      return stateCopy;

    case "LOGIN":
      stateCopy.userId = action.payload.data.data._id;
      return stateCopy;

    case "setSpinner":
      stateCopy.spinner = action.payload;
      return stateCopy;

    case "setSpinnerFalse":
      stateCopy.spinner = action.payload;
      return stateCopy;

    default:
      return stateCopy;
  }
}

const rootReducers = combineReducers({
  app: appReducer
});

const store = createStore(rootReducers, composeWithDevTools());

export default store;