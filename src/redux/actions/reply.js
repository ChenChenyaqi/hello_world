import {ADD_REPLY_ID, REMOVE_REPLY_ID} from '../constant'

const addReplyIdAction = data => ({type:ADD_REPLY_ID, data})

const removeReplyIdAction = () => ({type:REMOVE_REPLY_ID})

export{addReplyIdAction, removeReplyIdAction}
