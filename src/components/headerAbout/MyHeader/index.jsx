import React from 'react';
import {Layout, Row, Col} from "antd";
import MyHeaderNav from "../MyHeaderNav";
import LoginAndRegist from "../../functionModuleAbout/LoginAndRegist";

const {Header} = Layout

const MyHeader = () => {

    return (
        <Header
            className="header"
            style={{backgroundColor: "#fff", height:'auto'}}>
            <Row>
                <Col xs={8} sm={4} md={4} lg={4} xl={4}>
                    {/*logo*/}
                    <img className="logo" src="/img/logo.png" alt="logo"/>
                </Col>
                <Col xs={11} sm={16} md={16} lg={16} xl={16}>
                    {/*/!*顶部导航*!/*/}
                    <MyHeaderNav/>
                </Col>
                <Col xs={5} sm={4} md={4} lg={4} xl={4}>
                    {/*右上角登录与注册*/}
                    <div className="login-regist">
                        <LoginAndRegist/>
                    </div>
                </Col>
            </Row>
        </Header>
    );

}

export default MyHeader;
