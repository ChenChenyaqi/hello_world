
/*
*   如果点击了一个回复，则state为这个评论的id，再点一下，则将state置空
* */

const initState = "";
export default function currentReplyReducer(preState=initState, action) {
    const {type, data} = action
    switch(type){
        case 'add':
            return data
        case 'remove':
            return ""
        default:
            return preState
    }
}
