import React from 'react';
import {Layout} from "antd";
import MyHeaderNav from "./MyHeaderNav";
import LoginAndRegist from "./MyHeaderNav/LoginAndRegist";
import './index.css'
import {Link} from "react-router-dom";

const {Header} = Layout

const MyHeader = () => {

    return (
        <Header
            className="header"
            style={{backgroundColor: "#fff"}}>
            {/*logo*/}
            <Link to={'/'}><img className="logo" src="/img/logo.png" alt="logo"/></Link>

            {/*顶部导航*/}
            <MyHeaderNav/>

            {/*右上角登录与注册*/}
            <div className="login-regist">
                <LoginAndRegist/>
            </div>
        </Header>
    );

}

export default MyHeader;
