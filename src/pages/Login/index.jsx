import React from 'react';
import {Form, Input, Button, Checkbox, Layout, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import axios from "axios";
import './index.css'
import localhost from "../../utils/localhost";

// 登录组件
const Login = (props) => {

    // 获取本地存储中的用户数据
    // 用户是否点击记住我
    const remember = localStorage.getItem("remember")
    // 用户名
    const username = localStorage.getItem("username")
    // 密码
    const password = localStorage.getItem("password")

    // 用户点击登录后的回调
    const onFinish = (values) => {
        // 收集页面数据
        const {username, password, remember} = values
        const userObj = {username, password}
        const userJson = JSON.stringify(userObj)
        // 发送请求确认是否可以登录
        axios.post(`http://${localhost}:8080/user/login`,
            userJson,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                if (response.data.msg === "登录成功") {
                    // 提示登录成功
                    message.success(response.data.msg)
                    // 保存token、用户名、密码
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("username", username)
                    localStorage.setItem("password", password)
                    // 如果点击了记住我，则保存
                    if (remember) {
                        localStorage.setItem("remember", remember)
                    } else {
                        localStorage.setItem("remember", "")
                    }
                    // 登录成功跳转主页面
                    props.history.push("/")
                } else {
                    // 提示用户名或密码错误
                    message.error(response.data.msg)
                }
            },
        )
    };

    return (
        <Layout className="site-layout-background" style={{padding: '24px 0'}}>
            <div className="login-form-wrapper">
                <div className="login-title">
                    登录
                </div>
                <div className="login-all-form">
                    {/*登录表单*/}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                            username: remember ? username : "",
                            password: remember ? password : ""
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{
                                type: "string",
                                required: true, message: "请输入用户名!"
                            },
                                () => ({
                                    validator(_, value) {
                                        // 用户名长度在4至12位之间
                                        if (!value || (value.length >= 4 && value.length <= 12)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('用户名不合法！'));
                                    },
                                }),
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{
                                required: true, type: "string",
                                message: '请输入密码!'
                            },
                                () => ({
                                    validator(_, value) {
                                        // 密码在6至18位之间
                                        if (!value || (value.length >= 6 && value.length <= 18)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('密码不合法！'));
                                    },
                                }),
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>
                            <Link className="login-form-forgot" to={"/forget"}>忘记密码</Link>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>&nbsp;
                            或者 &nbsp;<Link to={'/regist'}>注册</Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Layout>
    );

}

export default Login;
