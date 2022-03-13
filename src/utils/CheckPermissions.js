import axios from "axios";
import localhost from "./localhost";
import store from "../redux/store";
import {addPermission, removePermission} from "../redux/actions/permission";

export default function (resolve, reject) {
    // 获取token
    const token = localStorage.getItem("token")
    if(!token){
        store.dispatch(removePermission())
    }
    axios.get(`http://${localhost}:8080/checkPermission`,
        {headers: {token: token}}).then(
        response => {
            if(response.data === false){
                // 如果没有权限，则移除token
                store.dispatch(removePermission())
                localStorage.removeItem("token")
                if(reject){
                    reject(false)
                }
            } else {
                store.dispatch(addPermission())
                if(resolve){
                    resolve(true)
                }
            }
        }
    )
}
