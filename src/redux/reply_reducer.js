const initState = "";

export default function currentReplyReducer(preState=initState, action) {
    const {type, data} = action
    switch(type){
        case 'add':
            return data
        default:
            return preState
    }
}
