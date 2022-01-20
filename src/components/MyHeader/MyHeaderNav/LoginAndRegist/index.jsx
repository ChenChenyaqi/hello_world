import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";


const LoginAndRegist = () => {

    const [isLogin, setIsLogin] = useState(false)
    const [username, setUserName] = useState("")

    const token = localStorage.getItem("token")

    useEffect(()=>{
        if (token) {
            const usernameVal = localStorage.getItem("username")
            setIsLogin(true)
            setUserName(usernameVal)
        }
    },[token])



    const logout = () => {
        localStorage.removeItem("token")
        setIsLogin(false)
        setUserName("")
    }

    return (
        <div>
            <div style={{display: isLogin ? "none" : ""}}>
                {/*<a href="/">登录</a>&nbsp;&nbsp;&nbsp;*/}
                <Link to={'/login'}>登录</Link>&nbsp;&nbsp;
                {/*<a href="/">注册</a>*/}
                <Link to={'/regist'}>注册</Link>
            </div>
            <div style={{display: isLogin ? "" : "none"}}>
                欢迎: <a href="/">{username}</a>&nbsp;&nbsp;
                <Link onClick={logout} to={'/login'}>退出登录</Link>
            </div>
        </div>
    );
}

export default LoginAndRegist;