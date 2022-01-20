import axios from "axios";
import { message} from 'antd';
import localhost from "./localhost";

export default function (msg) {
    const token = localStorage.getItem("token")
    axios.get(`http://${localhost}:8080/checkPermission`,
        {headers: {token: token}}).then(
        response => {
            if(response.data === false){
                localStorage.removeItem("token")
                message.warning(msg);
            }
        }
    )
}