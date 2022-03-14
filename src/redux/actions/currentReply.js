import {ADD_CURRENTREPLY_ID, REMOVE_CURRENTREPLY_ID} from '../constant'

const addCurrentReplyIdAction = data => ({type:ADD_CURRENTREPLY_ID, data})

const removeCurrentReplyIdAction = () => ({type:REMOVE_CURRENTREPLY_ID})

export{addCurrentReplyIdAction, removeCurrentReplyIdAction}
