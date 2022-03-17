import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom'
import {Empty, Menu, message, Popconfirm, Divider, Modal, Upload} from 'antd';
import {HomeOutlined, MessageOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import './index.css'
import axios from "axios";
import Pubsub from 'pubsub-js';
import localhost from "../../utils/localhost";
import Post from "../../containers/Post";
import Loading from "../../components/functionModuleAbout/Loading";
import {Link} from "react-router-dom";
import CheckPermissions from "../../utils/CheckPermissions";
import store from "../../redux/store";
import MyAvatar from "../../components/userAbout/MyAvatar";
import compressImage from "../../utils/compressImage";
import {nanoid} from "nanoid";

// 个人中心组件
const User = (props) => {

    //
    const [current, setCurrent] = useState('post')
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showUploadAvatar, setShowUploadAvatar] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [avatarLoading, setAvatarLoading] = useState(false)
    const [avatarUploadUrl, setAvatarUploadUrl] = useState('')
    // 本评论作者头像
    const [userAvatar,setUserAvatar] = useState('')

    const username = localStorage.getItem("username")


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

    // 上传头像
    const uploadAvatar = () => {
        setShowUploadAvatar(true)
    }

    // 确认上传
    const handleOk = () => {
        if(avatarUploadUrl){
            setShowUploadAvatar(false)
            setUserAvatar(avatarUploadUrl)
            setAvatarUploadUrl('')
            axios.get(`http://${localhost}:8080/user/avatar/confirm?username=${username}`)
        }
    }

    // 取消上传
    const handleCancel = () => {
        setShowUploadAvatar(false)
        setAvatarUploadUrl('')
    }

    // 获取头像地址
    const getAvatar = () => {
        axios.get(`http://${localhost}:8080/user/avatar/unstored?username=${username}`).then(
            response => {
                setAvatarUploadUrl(response.data)
            }
        )
    }

    const avatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setAvatarLoading(true)
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            setAvatarLoading(false)
            getAvatar()
        }
    }

    // 头像上传之前的回调
    const beforeAvatarUpload = (file) => {
        // 判断头像类型
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 类型图片!');
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('图片大小必须小于 5MB!');
            return Upload.LIST_IGNORE
        }
        return new Promise((resolve, reject) => {
            const newFile = compressImage(file)
            resolve(newFile)
        });
    }

    useEffect(() => {
        // 获取用户头像
        axios.get(`http://${localhost}:8080/user/avatar?username=${username}`).then(
            response => {
                setUserAvatar(response.data)
            }
        )
        // 发送请求获取用户发的帖子
        setIsLoading(true)
        axios.get(`http://${localhost}:8080/post/getByUsername?username=${username}`).then(
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
                            <div className="user-avatar" onClick={uploadAvatar}>
                                <MyAvatar username={username} setSize={true} url={userAvatar || ''}/>
                            </div>
                            <Modal title="上传头像" visible={showUploadAvatar}
                                   onOk={handleOk} onCancel={handleCancel}
                                   okText="确认" cancelText="取消"
                                   confirmLoading={confirmLoading}>
                                <div>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={`http://${localhost}:8080/user/avatar/save`}
                                        headers={{
                                            contentType: "multipart/form-data",
                                            username: username,
                                            avatarId: nanoid()
                                        }}
                                        beforeUpload={beforeAvatarUpload}
                                        onChange={avatarChange}
                                    >
                                        {avatarUploadUrl ? <img className="avatar-upload" src={avatarUploadUrl}  alt="avatar"
                                                                style={{width: '100%'}}/> :
                                            <div>
                                                {avatarLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                                                <div style={{marginTop: 8}}>Upload</div>
                                            </div>}
                                    </Upload>
                                </div>
                            </Modal>
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
