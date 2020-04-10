import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

let initialState = {
  userName: "",
  userMobile: "",
  itemsOrdered: [],
  totalPrice: 0,
  paymentMode: "Cash",
  waiterId: "",
  tableId: ""
}

function appReducer(state = initialState, action) {
  return state;
}

const rootReducers = combineReducers({
  app: appReducer
});

const store = createStore(rootReducers, composeWithDevTools());

export default store;