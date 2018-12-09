import { createStore } from 'redux'


const initialState = {
  ingreds: [],
  hasIngreds: false,
  dish: null,
  hasDish: false
}

const reducer = (state = initialState, action) => {
  return state
}

const store = createStore(reducer)
export default store