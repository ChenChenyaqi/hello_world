import {ADD_PERMISSION, REMOVE_PERMISSION} from "../constant";

const addPermission = () => ({type:ADD_PERMISSION})
const removePermission = () => ({type:REMOVE_PERMISSION})

export {addPermission, removePermission}
