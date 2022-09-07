import { createStore } from "redux";

/**
 * This is a reducer - a function that takes a current state value and an
 * action object describing "what happened", and returns a new state value.
 * A reducer's function signature is: (state, action) => newState
 *
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object. It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * You can use any conditional logic you want in a reducer. In this example,
 * we use a switch statement, but it's not required.
 */
function counterReducer(state = {alerts:[]}, action) {
  switch (action.type) {
    case "change user":
      return {...state,user:action.user}
    case "edit profile":
      state.user.username = action.details.username
      state.user.email = action.details.email
      state.user.firstName = action.details.firstName
      state.user.lastName = action.details.lastName
      return state
      
    case "alert":
      state.alerts.push(action.alert)
      return state
    default:
      return state;
  }
}
const store = createStore(counterReducer);
export default store;
