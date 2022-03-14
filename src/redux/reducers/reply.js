import {ADD_REPLY_ID, REMOVE_REPLY_ID} from '../constant'
/*
*   如果点击了一个回复，则state为这个回复的id，再点一下，则将state置空
* */

const initState = "";
export default function replyReducer(preState=initState, action) {
    const {type, data} = action
    switch(type){
        case ADD_REPLY_ID:
            return data
        case REMOVE_REPLY_ID:
            return ""
        default:
            return preState
    }
}
