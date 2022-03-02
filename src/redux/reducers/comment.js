import {ADD_COMMENT_ID, REMOVE_COMMENT_ID} from '../constant'
/*
*   如果点击了一个回复，则state为这个评论的id，再点一下，则将state置空
* */

const initState = "";
export default function currentCommentReducer(preState=initState, action) {
    const {type, data} = action
    switch(type){
        case ADD_COMMENT_ID:
            return data
        case REMOVE_COMMENT_ID:
            return ""
        default:
            return preState
    }
}
