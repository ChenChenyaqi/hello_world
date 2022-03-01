import {ADD_COMMENT_ID, REMOVE_COMMENT_ID} from './constant'

const addCommentId = data => ({type:ADD_COMMENT_ID, data})

const removeCommentId = () => ({type:REMOVE_COMMENT_ID})

export{addCommentId, removeCommentId}
