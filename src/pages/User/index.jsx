import React, {useEffect, useState} from 'react';
import {Avatar, Empty, Menu, message, Popconfirm} from 'antd';
import {AntDesignOutlined, MailOutlined} from '@ant-design/icons';
import './index.css'
import axios from "axios";
import localhost from "../../utils/localhost";
import Post from "../../components/postAbout/Post";
import Loading from "../../components/functionModuleAbout/Loading";
import GetMoreButton from "../../components/functionModuleAbout/GetMoreButton";

// 个人中心组件
const User = () => {

    const [current, setCurrent] = useState('mail')
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
        <div className="user">
            <div className="user-info">
                <div className="user-avatar">
                    <Avatar
                        size={{xs: 20, sm: 25, md: 35, lg: 40, xl: 60, xxl: 80}}
                        icon={<AntDesignOutlined/>}
                    />
                </div>
                <div className="user-other">
                    <h2>{localStorage.getItem("username")}</h2>
                </div>
            </div>
            <div>
                <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                    <Menu.Item key="post" icon={<MailOutlined/>}>
                        我的帖子
                    </Menu.Item>
                    <Menu.Item key="message" icon={<MailOutlined/>}>
                        消息
                    </Menu.Item>
                    <Menu.Item key="comment" icon={<MailOutlined/>}>
                        评论
                    </Menu.Item>
                </Menu>
            </div>
            <div className="mypost-list">
                {
                    isLoading ? <Loading isLoading={isLoading}/> : <>
                        {
                            posts.length === 0 ? <Empty description={<span style={{fontSize: '15px'}}>暂无帖子</span>} imageStyle={{height: 70}}/>
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
                                    </div>
                                )
                            })
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default User;
