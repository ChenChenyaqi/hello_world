import {ADD_POST_ID, REMOVE_POST_ID} from '../constant'

const initState = ""
export default function currentPostReducer(preState=initState, action) {
    const {type, data} = action
    switch(type){
        case ADD_POST_ID:
            return data
        case REMOVE_POST_ID:
            return ""
        default:
            return preState
    }
}
