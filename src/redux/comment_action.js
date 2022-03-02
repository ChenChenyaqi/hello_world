import {ADD_COMMENT_ID, REMOVE_COMMENT_ID} from './constant'

const addCommentIdAction = data => ({type:ADD_COMMENT_ID, data})

const removeCommentIdAction = () => ({type:REMOVE_COMMENT_ID})

export{addCommentIdAction, removeCommentIdAction}
