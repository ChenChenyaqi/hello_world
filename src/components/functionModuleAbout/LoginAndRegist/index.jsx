import React, {Component} from 'react';
import {UserOutlined} from "@ant-design/icons"
import {Link} from "react-router-dom";
import Pubsub from 'pubsub-js'
import './index.css'

// pubsub ID
const pubSubIdList = []

class LoginAndRegist extends Component {

    state = {
        // 是否登录
        isLogin: false,
        // 是否进入个人中心
        isEnterUser: false
    }

    componentDidMount() {
        // token
        const token = localStorage.getItem("token")
        if (token) {
            this.setState({isLogin: true})
        }
        const p1 = Pubsub.subscribe("logout", () => {
            this.setState({isLogin: false})
        })
        const p2 = Pubsub.subscribe("login", () => {
            this.setState({isLogin: true})
        })
        const p3 = Pubsub.subscribe("isEnterUser", (_, isEnterUser) => {
            this.setState({isEnterUser: true})
        })

        pubSubIdList.push(p1, p2, p3)
    }

    componentWillUnmount() {
        pubSubIdList.map((item) => {
            return Pubsub.unsubscribe(item)
        })
    }

    render() {
        const {isLogin, isEnterUser} = this.state
        return (
            <div>
                <div className="login-regist-button" style={{display: isLogin ? "none" : "block"}}>
                    <Link to={'/login'}>登录</Link>&nbsp;&nbsp;
                    <Link to={'/regist'}>注册</Link>
                </div>
                <div className="user-center" style={{display: isLogin && !isEnterUser ? "block" : "none"}}>
                    <Link to={'/user'}><UserOutlined style={{fontSize: '22px'}}/></Link>
                </div>
            </div>
        )
    }
}

export default LoginAndRegist;
