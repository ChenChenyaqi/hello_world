import React, {useState, useEffect} from 'react';
import {UserOutlined} from "@ant-design/icons"
import {Link} from "react-router-dom";
import Pubsub from 'pubsub-js'


const LoginAndRegist = () => {

    // 是否登录
    const [isLogin, setIsLogin] = useState(false)

    const token = localStorage.getItem("token")

    useEffect(()=>{
        if (token) {
            setIsLogin(true)
        }
        Pubsub.subscribe("logout",() => {
            setIsLogin(false)
        })
        Pubsub.subscribe("login",()=>{
            setIsLogin(true)
        })
    },[])

    return (
        <div>
            <div style={{display: isLogin ? "none" : ""}}>
                {/*<a href="/">登录</a>&nbsp;&nbsp;&nbsp;*/}
                <Link to={'/login'}>登录</Link>&nbsp;&nbsp;
                {/*<a href="/">注册</a>*/}
                <Link to={'/regist'}>注册</Link>
            </div>
            <div style={{display: isLogin ? "" : "none"}}>
                <Link to={'/user'}><UserOutlined style={{fontSize:'22px'}}/></Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
        </div>
    );
}

export default LoginAndRegist;
