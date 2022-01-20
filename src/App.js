import React from 'react';
import {Layout} from 'antd';
import {Route, Switch} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import MyHeader from "./components/MyHeader";
import MyFooter from "./components/MyFooter";
import Login from "./components/MyHeader/MyHeaderNav/LoginAndRegist/Login";
import Regist from "./components/MyHeader/MyHeaderNav/LoginAndRegist/Regist";
import Main from "./components/Main";
import Forget from "./components/MyHeader/MyHeaderNav/LoginAndRegist/Forget";
import Activity from "./components/Activity";
import axios from "axios";
import localhost from "./utils/localhost";


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
                <Content style={{padding: '0 50px'}}>
                    {/*匹配路由，登录页、注册页、主页*/}
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/regist" component={Regist}/>
                        <Route path="/forget" component={Forget}/>
                        <Route path="/activity" component={Activity}/>
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
