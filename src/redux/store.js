import {createStore} from "redux";
import currentCommentReducer from "./comment_reducer"

export default createStore(currentCommentReducer)
