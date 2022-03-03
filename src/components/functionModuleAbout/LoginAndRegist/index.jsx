import React, {useState, useEffect} from 'react';
import {UserOutlined} from "@ant-design/icons"
import {Link} from "react-router-dom";
import Pubsub from 'pubsub-js'
import './index.css'


const LoginAndRegist = () => {

    // 是否登录
    const [isLogin, setIsLogin] = useState(false)
    // 是否进入个人中心
    const [isEnterUser, setIsEnterUser] = useState(false)

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
        Pubsub.subscribe("isEnterUser", (_, isEnterUser) => {
            setIsEnterUser(isEnterUser)
        })
    },[])

    return (
        <div>
            <div className="login-regist-button" style={{display: isLogin ? "none" : ""}}>
                {/*<a href="/">登录</a>&nbsp;&nbsp;&nbsp;*/}
                <Link to={'/login'}>登录</Link>&nbsp;&nbsp;
                {/*<a href="/">注册</a>*/}
                <Link to={'/regist'}>注册</Link>
            </div>
            <div className="user-center" style={{display: isLogin && !isEnterUser ? "" : "none"}}>
                <Link to={'/user'}><UserOutlined style={{fontSize:'22px'}}/></Link>
            </div>
        </div>
    );
}

export default LoginAndRegist;
