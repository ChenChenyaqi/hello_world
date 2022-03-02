import {ADD_POST_ID, REMOVE_POST_ID} from '../constant'

const addPostIdAction = (data) => ({type:ADD_POST_ID, data})
const removePostIdAction = () => ({type:REMOVE_POST_ID})

export {addPostIdAction, removePostIdAction}

