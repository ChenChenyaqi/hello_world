import React from 'react';
import {Layout} from 'antd';
import {Route, Switch} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import MyHeader from "./components/headerAbout/MyHeader";
import MyFooter from "./components/footerAbout/MyFooter";
import Login from "./pages/Login";
import Regist from "./pages/Regist";
import Main from "./components/mainAbout/Main";
import Forget from "./pages/Forget";
import Activity from "./pages/Activity";
import axios from "axios";
import localhost from "./utils/localhost";
import User from "./pages/User";
import './App.css'


const {Content} = Layout;

const App = (props) => {

    // 当用户离开编辑帖子或点击刷新页面时，由于图片已经被提交，页面虽已经清空
    // 但图片会随着用户点击发布，而与帖子绑定，这不是想要的结果
    // 因而，在用户离开编辑帖子时，就把尚未与帖子进行绑定的图片删除调
    if(!localStorage.getItem("edit-post")){
        localStorage.setItem("edit-post","/")
    }
    if(localStorage.getItem("edit-post") !== props.location.pathname){
        axios.get(`http://${localhost}:8080/picture/delete/unstored?username=${localStorage.getItem("username")}`)
    }
    onpageshow = () => {
        axios.get(`http://${localhost}:8080/picture/delete/unstored?username=${localStorage.getItem("username")}`)
    }

    // CheckPermissions("root")

    return (
        <div>
            <Layout>
                {/*顶部导航条*/}
                <MyHeader/>
                <Content className="main-content">
                    {/*匹配路由，登录页、注册页、主页*/}
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/regist" component={Regist}/>
                        <Route path="/forget" component={Forget}/>
                        <Route path="/activity" component={Activity}/>
                        <Route path="/user" component={User}/>
                        <Route path="/" component={Main}/>
                    </Switch>
                </Content>
                {/*页脚*/}
                <MyFooter/>
                {/*<img src="https://helloworld-data.oss-cn-chengdu.aliyuncs.com/123.png"*/}
                {/*     alt="123"/>*/}
            </Layout>
        </div>
    );
}

export default withRouter(App);
