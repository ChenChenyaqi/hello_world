import {createStore, combineReducers} from "redux";
import currentCommentReducer from "./reducers/comment"
import currentPostReducer from "./reducers/post";

// 合并reducer
const allReducer = combineReducers({
    commentId:currentCommentReducer,
    postId:currentPostReducer
})

export default createStore(allReducer)
