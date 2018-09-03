import * as types from '../constants/ActionTypes'

const currentUser = (state = [], action) => {
  console.log(action);
  switch (action.type) {
    case types.ADD_USER:
      return action.name
    default:
      return state
  }
}

export default currentUser
