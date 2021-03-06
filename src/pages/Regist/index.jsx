import React from 'react';
import {Button, Form, Input, Layout, message, Row, Col} from "antd";
import {LockOutlined, UserOutlined, MailOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import axios from "axios";
import './index.css'
import localhost from "../../utils/localhost";

// 注册组件
const Regist = (props) => {

    // 获取验证码超时时间
    const [timeOut, setTimeOut] = React.useState(60)
    // 控制是否可以点击获取验证码按钮
    const [sendCodeHidden, setSendCodeHidden] = React.useState(false)
    // 用户邮箱
    const [email, setEmail] = React.useState(null)
    // 邮箱验证码
    const [code, setCode] = React.useState(null)

    // 获取验证码
    const getCode = () => {
        // 验证码正则
        let pattern = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/
        if (!pattern.test(email)) {
            return
        }
        setSendCodeHidden(true)
        // 发送请求获取验证码
        axios.get(`http://${localhost}:8080/user/save/seccode`, {
            headers: {"userEmail": email}
        }).then(
            response => {
                setCode(response.data.code)
            },
            error => {
                message.error("获取验证码失败，请重试！")
            }
        )
    }

    // 获取邮箱
    const getEmail = (e) => {
        setEmail(e.target.value)
    }

    // 用户点击注册后的回调
    const onFinish = (values) => {
        // 检查验证码是否正确
        if (!code || code.toLowerCase() !== values.code.toLowerCase()) {
            message.error("验证码错误！")
            return
        }
        // 收集表单数据
        const {username, password} = values
        const userObj = {username, password, email}
        const userJson = JSON.stringify(userObj)
        // 发送请求保存用户
        axios.post(`http://${localhost}:8080/user/save`,
            userJson,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                if (response.data === "注册成功") {
                    // 提示注册成功
                    message.success(response.data)
                    // 保存用户名到本地存储
                    localStorage.setItem("username", username)
                    localStorage.removeItem("password")
                    // 登录成功跳转登录页面
                    props.history.push("/login");
                } else {
                    // 提示错误信息
                    message.error(response.data + "，用户名已占用！")
                }

            }
        )
    };

    React.useEffect(() => {
        // 当用户点击获取验证码后，给一个倒计时
        if (sendCodeHidden) {
            let timer = setInterval(() => {
                if (timeOut > 0) {
                    setTimeOut(timeOut - 1)
                } else {
                    setSendCodeHidden(false)
                    setTimeOut(60)
                    setCode(null)
                }

            }, 1000)
            return () => {
                clearInterval(timer)
            }
        }
    }, [timeOut, sendCodeHidden])


    return (
        <Layout className="site-layout-background" style={{padding: '24px 0'}}>
            <div className="regist-form-wrapper">
                <div className="regist-title">
                    注册
                </div>
                <div className="regist-all-form">
                    <Form
                        name="normal_regist"
                        className="regist-form"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{
                                type: "string",
                                required: true,
                                message: "请输入用户名！"
                            },
                                () => ({
                                    validator(_, value) {
                                        let pattern = /^[a-zA-Z0-9]{4,12}$/
                                        if (!value || pattern.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('用户名必须是4-12位字母或数字组合!'));
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
                                        let pattern = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/
                                        if (!value || pattern.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('密码必须是6-18位字母和数字组合!'));
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
                        <Form.Item
                            name="repeat-password"
                            rules={[{
                                required: true, type: "string",
                                message: '请输入确认密码!'
                            },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('前后密码不一致!'));
                                    },
                                }),
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="确认密码"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{
                                type: "string",
                                required: true,
                                message: "请输入邮箱！"
                            },
                                () => ({
                                    validator(_, value) {
                                        let pattern = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/
                                        if (!value || pattern.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('邮箱不合法!'));
                                    },
                                }),
                            ]}
                        >
                            <Input onChange={getEmail} prefix={<MailOutlined className="site-form-item-icon"/>}
                                   placeholder="邮箱"/>
                        </Form.Item>
                        <Form.Item extra="我们会发送一份电子邮件给您.">
                            <Row gutter={8}>
                                <Col span={12}>
                                    <Form.Item
                                        name="code"
                                        noStyle
                                        rules={[{required: true, message: '请输入验证码！'}]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <div style={{position: "relative"}}>
                                        <Button disabled={sendCodeHidden} onClick={getCode}>获取验证码</Button>
                                        {
                                            sendCodeHidden ?
                                                <div style={{position: "absolute"}}>{timeOut}秒后重试</div> : ""
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="regist-form-button">
                                注册
                            </Button>&nbsp;
                            或者 &nbsp;<Link to={'/login'}>登录</Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Layout>
    );

}

export default Regist;
