import React, {Component} from 'react';
import {Avatar, Menu, Dropdown} from 'antd';
import {AntDesignOutlined, MailOutlined, DownOutlined} from '@ant-design/icons';
import './index.css'
import axios from "axios";
import localhost from "../../utils/localhost";
import Post from "../Main/AllPosts/Post";

class User extends Component {

    state = {
        current: 'mail',
        posts: null
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({current: e.key});
    };

    componentDidMount() {
        axios.get(`http://${localhost}:8080/post/getByUsername`, {
            headers: {
                username: localStorage.getItem("username")
            }
        }).then(response => {
            this.setState(() => {
                return {posts: response.data}
            })
        })
    }

    onClick(postId){
        return ()=>{
            axios.get(`http://${localhost}:8080/post/delete`,{
                headers:{
                    postId
                }
            }).then(response => {
                const {posts} = this.state
                let delIndex = 0;
                for(let i = 0; i < posts.length; i++){
                    if(posts[i].postId === postId){
                        delIndex = i;
                        break;
                    }
                }
                posts.splice(delIndex,1)
                this.setState({posts})
            })
        }
    }

    render() {
        const {current, posts} = this.state;

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
                    <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                        <Menu.Item key="xiaoxi" icon={<MailOutlined/>}>
                            消息
                        </Menu.Item>
                        <Menu.Item key="pinglun" icon={<MailOutlined/>}>
                            评论
                        </Menu.Item>
                    </Menu>
                </div>
                <div>
                    {
                        !posts ? null : posts.map((post) => {
                            return (
                                <div key={post.postId} className="post-item">
                                    <Post post={post}/>
                                    <div className="delete-button">
                                        <Dropdown overlay={
                                            <Menu onClick={this.onClick(post.postId)}>
                                                <Menu.Item key="1">
                                                    删除
                                                </Menu.Item>
                                            </Menu>
                                        }>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                操作 <DownOutlined/>
                                            </a>
                                        </Dropdown>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        );
    }
}

export default User;
