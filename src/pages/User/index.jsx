import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom'
import {Avatar, Empty, Menu, message, Popconfirm, Divider} from 'antd';
import {AntDesignOutlined, HomeOutlined, MessageOutlined} from '@ant-design/icons';
import './index.css'
import axios from "axios";
import Pubsub from 'pubsub-js';
import localhost from "../../utils/localhost";
import Post from "../../containers/Post";
import Loading from "../../components/functionModuleAbout/Loading";
import {Link} from "react-router-dom";
import CheckPermissions from "../../utils/CheckPermissions";
import store from "../../redux/store";

// 个人中心组件
const User = (props) => {

    // const arr = props.match.path.split('/');
    // const username = arr[arr.length - 1];
    const [current, setCurrent] = useState('post')
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    // 切换导航
    const handleClick = e => {
        console.log('click ', e);
        setCurrent(e.key)
    };

    // 删除帖子
    const deletePost = postId => {
        return () => {
            axios.get(`http://${localhost}:8080/post/delete?postId=${postId}`).then(response => {
                const oldPosts = [...posts]
                let delIndex = 0;
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].postId === postId) {
                        delIndex = i;
                        break;
                    }
                }
                oldPosts.splice(delIndex, 1)
                message.success("删除成功！")
                setPosts(oldPosts)

            })
        }
    }

    // 点击退出登录后
    const logout = () => {
        localStorage.removeItem("token")
        CheckPermissions()
        Pubsub.publish("logout", {})
        props.history.replace('/login')
    }

    useEffect(() => {
        // 发送请求获取用户发的帖子
        setIsLoading(true)
        axios.get(`http://${localhost}:8080/post/getByUsername?username=${localStorage.getItem("username")}`).then(
            response => {
                setIsLoading(false)
                setPosts(response.data)
            })
    }, [])

    return (
        <>
            {
                !store.getState().permission ? <Redirect to={'/'}/> :
                    <div className="user">
                        <div className="user-info">
                            <div className="user-avatar">
                                <Avatar
                                    size={{xs: 30, sm: 35, md: 40, lg: 45, xl: 60, xxl: 80}}
                                    icon={<AntDesignOutlined/>}
                                />
                            </div>
                            <div className="user-other">
                                <h2>{localStorage.getItem("username")}</h2>
                            </div>
                            <div className="logout">
                                <Link onClick={logout} to={'/login'}>退出登录</Link>
                            </div>
                        </div>
                        <div>
                            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                                <Menu.Item key="post" icon={<HomeOutlined/>}>
                                    我的帖子
                                </Menu.Item>
                                <Menu.Item key="message" icon={<MessageOutlined/>}>
                                    消息
                                </Menu.Item>
                            </Menu>
                        </div>
                        <div className="my-post-list">
                            {
                                isLoading ? <Loading isLoading={isLoading}/> : <>
                                    {
                                        posts.length === 0 ?
                                            <Empty description={<span style={{fontSize: '15px'}}>暂无帖子</span>}
                                                   imageStyle={{height: 70}}/>
                                            : posts.map((post) => {
                                                return (
                                                    <div key={post.postId} className="post-item">
                                                        <Post post={post}/>
                                                        <div className="delete-button">
                                                            <Popconfirm
                                                                title="确认删除？"
                                                                okText="是"
                                                                cancelText="否"
                                                                onConfirm={deletePost(post.postId)}
                                                            >
                                                                <a href="#" onClick={(e) => {
                                                                    e.preventDefault()
                                                                }}>删除</a>
                                                            </Popconfirm>
                                                        </div>
                                                        <Divider/>
                                                    </div>
                                                )
                                            })
                                    }
                                </>
                            }
                        </div>
                    </div>
            }
        </>
    );
}

export default User;
