import {createStore, combineReducers} from "redux";
import currentCommentReducer from "./reducers/comment"
import currentPostReducer from "./reducers/post";
import permissionReducer from "./reducers/permission";
import replyReducer from "./reducers/reply";
import currentReply from "./reducers/currentReply";

// 合并reducer
const allReducer = combineReducers({
    commentId:currentCommentReducer,
    postId:currentPostReducer,
    permission:permissionReducer,
    replyId:replyReducer,
    currentReplyId:currentReply,
})

export default createStore(allReducer)
