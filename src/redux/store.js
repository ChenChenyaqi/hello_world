import {createStore, combineReducers} from "redux";
import currentCommentReducer from "./reducers/comment"
import currentPostReducer from "./reducers/post";
import permissionReducer from "./reducers/permission";

// 合并reducer
const allReducer = combineReducers({
    commentId:currentCommentReducer,
    postId:currentPostReducer,
    permission:permissionReducer
})

export default createStore(allReducer)
