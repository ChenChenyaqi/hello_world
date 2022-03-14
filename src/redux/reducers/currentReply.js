import {ADD_CURRENTREPLY_ID, REMOVE_CURRENTREPLY_ID} from '../constant'
/*
*
* */

const initState = "";
export default function currentCommentReducer(preState=initState, action) {
    const {type, data} = action
    switch(type){
        case ADD_CURRENTREPLY_ID:
            return data
        case REMOVE_CURRENTREPLY_ID:
            return ""
        default:
            return preState
    }
}
