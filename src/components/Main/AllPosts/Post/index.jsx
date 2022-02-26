import React from 'react';
import {Avatar, Typography, Image} from 'antd';
import {AntDesignOutlined} from '@ant-design/icons';
import './index.css'
import {timestampToTime} from '../../../../utils/timeUtils'
import axios from "axios";
import localhost from "../../../../utils/localhost";
import PostComment from "./PostComment";

const {Paragraph} = Typography

const Post = (props) => {
    const postId = props.post.postId
    const postAuthor = props.post.postAuthor
    const postTime = props.post.postTime
    const postContent = props.post.postContent
    // 处理时间
    const time = timestampToTime(postTime)
    // 本帖子所有图片路径
    const [picturesPath, setPicturesPath] = React.useState(null)
    // 点赞数
    const [likedCount, setLikedCount] = React.useState(0)
    // 评论数
    const [commentCount, setCommentCount] = React.useState(0)
    // 是否已经点过赞
    const [isLiked, setIsLiked] = React.useState(false)
    // 是否展示评论区
    const [showComment, setShowComment] = React.useState(false)

    // 点赞
    const liked = (e)=> {
        e.preventDefault()
        // 若没点过赞
        if(!isLiked){
            setLikedCount(likedCount+1)
            setIsLiked(true)
            axios.get(`http://${localhost}:8080/post/liked`,{
                headers:{
                    postId
                }
            })
            let arr = JSON.parse(localStorage.getItem("likedPostsId"))
            arr.push(postId)
            localStorage.setItem("likedPostsId", JSON.stringify(arr))
        } else {
            // 若点过赞，则取消赞
            setLikedCount(likedCount-1)
            setIsLiked(false)
            axios.get(`http://${localhost}:8080/post/unLiked`,{
                headers:{
                    postId
                }
            })
            let arr = JSON.parse(localStorage.getItem("likedPostsId"))
            for(let i = 0; i < arr.length; i++){
                if(arr[i] === postId){
                    arr.splice(i,1)
                }
            }
            localStorage.setItem("likedPostsId", JSON.stringify(arr))
        }
    }

    // 评论
    const comment = (e) => {
        e.preventDefault()
        // 点开评论区时
        if(showComment){
            setShowComment(false)
        } else {
            // 没点开评论区时
            setShowComment(true)
        }
    }

    React.useEffect(() => {
        axios.get(`http://${localhost}:8080/picture/getAll?postId=${props.post.postId}`).then(
            response => {
                if (response.data.length !== 0) {
                    for (let k = 0; k < response.data.length; k++) {
                        setPicturesPath(response.data)
                    }
                }
            }
        )
        // 查询本帖点赞量
        axios.get(`http://${localhost}:8080/post/likeCount`, {
            headers:{
                postId
            }
        }).then(
            response => {
                setLikedCount(JSON.parse(response.data))
            }
        )
        // 若没有这个likedPostsId，则为用户本地存储加上
        let likedPostsId = localStorage.getItem("likedPostsId")
        if(!likedPostsId){
            localStorage.setItem("likedPostsId", JSON.stringify([]))
        } else {
            // 若在likedPostsId 中发现了这个帖子的Id，说明用户已经点过赞了
            let arr = JSON.parse(likedPostsId)
            // 本帖在localStorage中的位置
            let index = -1
            for(let i = 0; i < arr.length; i++){
                if(arr[i] === postId){
                    index = i
                    break
                }
            }
            if(index >= 0){
                setIsLiked(true)
            }
        }
    },[])

    return (
        <div className="post-wrapper">
            <div className="author-info">
                <Avatar
                    size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 40, xxl: 100}}
                    icon={<AntDesignOutlined/>}
                />
                <div className="author-detail">
                    <div className="author-name">
                        {postAuthor}
                    </div>
                    <div className="author-time">
                        {time}
                    </div>
                </div>
            </div>
            <div className="post-content">
                <div className="post-text">
                    <Paragraph>
                        {postContent}
                    </Paragraph>
                </div>
                <div className="post-picture">
                    {
                        picturesPath && picturesPath.length !== 0 ? picturesPath.map((picturePath, index) => {
                            return <Image key={index}
                                          width={200}
                                          src={picturePath}
                            />
                        }) : ""
                    }

                </div>
                <div className="post-bottom">
                    <a onClick={liked}>
                        {
                            isLiked ? <i className="iconfont icon-dianzan1"/>:
                                <i className="iconfont icon-dianzan"/>
                        }
                        {
                            likedCount ? likedCount : <span>点赞</span>
                        }
                    </a>
                    <a  onClick={comment}><i className="iconfont icon-pinglun"/>
                        {
                            commentCount ? commentCount : <span>评论</span>
                        }
                    </a>
                </div>
                <div className="comment" style={{display:`${showComment ? "" : "none"}`}}>
                    <PostComment postId={postId} postAuthor={postAuthor}/>
                </div>
            </div>
        </div>
    );
}

export default Post;
