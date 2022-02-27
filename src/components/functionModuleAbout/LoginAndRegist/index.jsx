import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";


const LoginAndRegist = () => {

    // 是否登录
    const [isLogin, setIsLogin] = useState(false)
    // 获取用户名
    const [username, setUserName] = useState("")

    const token = localStorage.getItem("token")

    // 点击退出登录后
    const logout = () => {
        localStorage.removeItem("token")
        setIsLogin(false)
        setUserName("")
    }

    useEffect(()=>{
        if (token) {
            const usernameVal = localStorage.getItem("username")
            setIsLogin(true)
            setUserName(usernameVal)
        }
    },[token])

    return (
        <div>
            <div style={{display: isLogin ? "none" : ""}}>
                {/*<a href="/">登录</a>&nbsp;&nbsp;&nbsp;*/}
                <Link to={'/login'}>登录</Link>&nbsp;&nbsp;
                {/*<a href="/">注册</a>*/}
                <Link to={'/regist'}>注册</Link>
            </div>
            <div style={{display: isLogin ? "" : "none"}}>
                欢迎: <Link to={'/user'}>{username}</Link>&nbsp;&nbsp;
                <Link onClick={logout} to={'/login'}>退出登录</Link>
            </div>
        </div>
    );
}

export default LoginAndRegist;
