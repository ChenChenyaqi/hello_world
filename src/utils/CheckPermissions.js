import axios from "axios";
import { message} from 'antd';
import localhost from "./localhost";

export default function (msg) {
    // 获取token
    const token = localStorage.getItem("token")
    axios.get(`http://${localhost}:8080/checkPermission`,
        {headers: {token: token}}).then(
        response => {
            if(response.data === false){
                // 如果没有权限，则移除token
                localStorage.removeItem("token")
                message.warning(msg);
            }
        }
    )
}
