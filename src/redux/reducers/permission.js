import {ADD_PERMISSION, REMOVE_PERMISSION} from "../constant";

/*
* 对用户检查权限
* */
const initState = false;
export default function permissionReducer(preState=initState, action) {
    const {type} = action
    switch(type){
        case ADD_PERMISSION:
            return true
        case REMOVE_PERMISSION:
            return false
        default:
            return preState
    }
}
