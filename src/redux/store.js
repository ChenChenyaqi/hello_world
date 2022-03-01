import {createStore} from "redux";
import currentReplyReducer from "./reply_reducer"

export default createStore(currentReplyReducer)
