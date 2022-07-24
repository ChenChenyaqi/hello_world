import React, {useEffect, useState} from 'react';
import './index.css'
import {AntDesignOutlined} from "@ant-design/icons";
import {Avatar, Image, Comment, List, message} from "antd";
import AllComments from "../../commentAbout/AllComments";
import Pubsub from "pubsub-js";
import axios from "axios";
import localhost from "../../../utils/localhost";
import EditComment from "../../commentAbout/EditComment";
import {timestampToTime} from "../../../utils/timeUtils";
import {nanoid} from "nanoid";
import store from "../../../redux/store";

const pubSubId = []

const Detail = ({match:{path}}) => {

    let postId;
    const arr =  path.split('/');
    postId = arr[arr.length - 1];

    const [postTime, setPostTime] = useState(0);
    const [postAuthor, setPostAuthor] = useState("");
    const [postContent, setPostContent] = useState("")

    // 处理时间
    const time = timestampToTime(postTime)
    // 本帖子所有图片路径
    const [picturesPath, setPicturesPath] = useState(null)
    // 点赞数
    const [likedCount, setLikedCount] = useState(0)
    // 评论数
    const [commentCount, setCommentCount] = useState(0)
    // 点赞人员列表
    const [likedArray, setLikedArray] = useState([])
    // 是否已经点过赞
    const [isLiked, setIsLiked] = useState(false)
    // 控制回复框相关
    const [submitting, setSubmitting] = useState(false)
    const [value, setValue] = useState('')
    // 当前用户名
    const username = localStorage.getItem("username")

    useEffect(() => {
        axios.get(`http://${localhost}:8080/post/getById?postId=${postId}`)
            .then(({data}) => {
                setPostAuthor(data.postAuthor);
                setPostContent(data.postContent);
                setPostTime(data.postTime);
            })
    }, [])

    // 点赞
    const liked = (e) => {
        e.preventDefault()
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        // 若没点过赞
        if (!isLiked) {
            setLikedCount(likedCount + 1)
            setIsLiked(true)
            const newLikedArray = [...likedArray]
            newLikedArray.push(username)
            setLikedArray(newLikedArray)
            axios.get(`http://${localhost}:8080/post/update/likedArray?likedArray=${newLikedArray.join(',')}&postId=${postId}`)
            axios.get(`http://${localhost}:8080/post/liked?postId=${postId}`)

        } else {
            // 若点过赞，则取消赞
            setLikedCount(likedCount - 1)
            setIsLiked(false)
            const newLikedArray = [...likedArray]
            newLikedArray.pop()
            setLikedArray(newLikedArray)
            axios.get(`http://${localhost}:8080/post/update/likedArray?likedArray=${newLikedArray.join(',')}&postId=${postId}`)
            axios.get(`http://${localhost}:8080/post/unLiked?postId=${postId}`)

        }
    }

    // 发布评论
    const handleSubmit = () => {
        if(!store.getState().permission){
            return message.warn('请先登录！')
        }
        if (!value.trim()) {
            return message.info('请输入内容！')
        }
        setSubmitting(true)
        // 创建评论数据
        const newComment = {
            commentId: nanoid(),
            commentPostId: postId,
            commentAuthor: localStorage.getItem("username"),
            commentReplyAuthor: postAuthor,
            commentContent: value,
            commentTime: Date.now().toString(),
            commentLike: 0,
            commentDislike: 0,
        }
        // 保存到服务器
        axios.post(`http://${localhost}:8080/comment/save`, newComment, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            response => {
                setSubmitting(false)
                setValue('')
                const p3 = Pubsub.publish('newComment', newComment)
                pubSubId.push(p3)
            }
        )
    };

    // 获取输入的内容
    const handleChange = e => {
        setValue(e.target.value)
    };


    React.useEffect(() => {

        Pubsub.publish('showComment', {isGetComment: true, commentPostId: postId})

        // 获取本帖子的图片
        axios.get(`http://${localhost}:8080/picture?postId=${postId}`).then(
            response => {
                if (response.data.length !== 0) {
                    for (let k = 0; k < response.data.length; k++) {
                        setPicturesPath(response.data)
                    }
                }
            }
        )
        // 查询本帖点赞量
        axios.get(`http://${localhost}:8080/post/likeCount?postId=${postId}`).then(
            response => {
                setLikedCount(JSON.parse(response.data))
            }
        )
        // 查询本帖评论量
        axios.get(`http://${localhost}:8080/post/commentCount?postId=${postId}`).then(
            response => {
                setCommentCount(response.data)
            }
        )
        axios.get(`http://${localhost}:8080/post/likedArray?postId=${postId}`).then(
            response => {
                if (response.data) {
                    const likedArray = response.data.split(',')
                    if(likedArray.includes(username)){
                        setIsLiked(true)
                    }
                    setLikedArray(likedArray)
                }
            }
        )

        return () => {
            pubSubId.map(item => {
                return Pubsub.subscribe(item)
            })
        }
    }, [])

    return (
        <div className="detail-post wrapper">
            <div className="post-header">
                <div className="author-photo">
                    <Avatar
                        size={{xs: 45, sm: 50, md: 55, lg: 60, xl: 65, xxl: 70}}
                        icon={<AntDesignOutlined/>}
                    />
                </div>
                <div className="post-info">
                    <div className="post-author-name">
                        {postAuthor}
                    </div>
                    <div className="post-time">
                        {
                            postTime ? time : ""
                        }
                    </div>
                </div>
            </div>
            <div className="post-content">
                <div className="content">
                    {postContent}
                </div>
                <div className="post-picture">
                    {
                        picturesPath && picturesPath.length !== 0 ? <List
                            grid={{
                                gutter:5,
                                xs: 3,
                                sm: 3,
                                md: 3,
                                lg: 3,
                                xl: 3,
                                xxl: 3,
                            }}
                            dataSource={picturesPath}
                            renderItem={picturePath => (
                                <List.Item className="col" style={{backgroundImage: `url(${picturePath})`}}>
                                    <Image preview={true} className="image" src={picturePath} placeholder={true}/>
                                </List.Item>
                            )}
                        /> : null
                    }
                </div>
            </div>
            <div className="post-footer">
                <a onClick={liked}>
                    {
                        isLiked ? <i className="iconfont icon-dianzan1"/> :
                            <i className="iconfont icon-dianzan"/>
                    }
                    {
                        likedCount ? likedCount : <span>点赞</span>
                    }
                </a>
                <a>
                    <i className="iconfont icon-pinglun"/>
                    {
                        commentCount ? commentCount : <span>评论</span>
                    }
                </a>
            </div>
            <div className="comment-sort">
                <span>按时间排序</span>
            </div>
            <div className="divider"/>

            <div className="post-comments">
                {/*发布评论框*/}
                <Comment
                    avatar={<Avatar>icon={<AntDesignOutlined/>}</Avatar>}
                    style={{marginLeft: '10px'}}
                    content={
                        <EditComment
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
                <AllComments postId={postId}
                             postAuthor={postAuthor}
                             commentCount={commentCount}
                             isShowViewMore={false}/>
            </div>
        </div>
    );

}

export default Detail;
