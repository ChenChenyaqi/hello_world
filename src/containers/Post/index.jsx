import React, {useState} from 'react';
import {Avatar, Typography, Image, Comment, Row, Col} from 'antd';
import {AntDesignOutlined} from '@ant-design/icons';
import './index.css'
import {timestampToTime} from '../../utils/timeUtils'
import axios from "axios";
import localhost from "../../utils/localhost";
import AllComments from "../../components/commentAbout/AllComments";
import EditComment from "../../components/commentAbout/EditComment";
import Pubsub from 'pubsub-js'
import CheckPermissions from "../../utils/CheckPermissions";
import {nanoid} from "nanoid";
import {connect} from "react-redux";
import {addCommentIdAction, removeCommentIdAction} from "../../redux/actions/comment";
import {Link} from "react-router-dom";

const {Paragraph} = Typography
const pubSubId = []

// 帖子UI组件
const Post = (props) => {
    // 从props中获取数据
    const {postId, postAuthor, postTime, postContent} = props.post
    const {state, remove} = props
    // 处理时间
    const time = timestampToTime(postTime)
    // 本帖子所有图片路径
    const [picturesPath, setPicturesPath] = useState(null)
    // 点赞数
    const [likedCount, setLikedCount] = useState(0)
    // 评论数
    const [commentCount, setCommentCount] = useState(0)
    // 是否已经点过赞
    const [isLiked, setIsLiked] = useState(false)
    // 是否展示评论区
    const [showComment, setShowComment] = useState(false)
    // 控制回复框相关
    const [submitting, setSubmitting] = useState(false)
    const [value, setValue] = useState('')

    // 点赞
    const liked = (e) => {
        e.preventDefault()
        // 若没点过赞
        if (!isLiked) {
            setLikedCount(likedCount + 1)
            setIsLiked(true)
            axios.get(`http://${localhost}:8080/post/liked?postId=${postId}`)
            let arr = JSON.parse(localStorage.getItem("likedPostsId"))
            arr.push(postId)
            localStorage.setItem("likedPostsId", JSON.stringify(arr))
        } else {
            // 若点过赞，则取消赞
            setLikedCount(likedCount - 1)
            setIsLiked(false)
            axios.get(`http://${localhost}:8080/post/unLiked?postId=${postId}`)
            let arr = JSON.parse(localStorage.getItem("likedPostsId"))
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === postId) {
                    arr.splice(i, 1)
                }
            }
            localStorage.setItem("likedPostsId", JSON.stringify(arr))
        }
    }

    // 评论
    const comment = (e) => {
        e.preventDefault()
        if (state.commentId) {
            remove()
        }
        // 点开评论区时
        if (showComment) {
            setShowComment(false)
            const p1 = Pubsub.publish('showComment', {isGetComment: false, commentPostId: postId})
            pubSubId.push(p1)
        } else {
            // 没点开评论区时
            setShowComment(true)
            const p2 = Pubsub.publish('showComment', {isGetComment: true, commentPostId: postId})
            pubSubId.push(p2)
        }
    }

    // 发布评论
    const handleSubmit = () => {
        CheckPermissions("请先登录！")
        if (!value) {
            return;
        }
        if (!localStorage.getItem("token")) {
            return;
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

    // 去详细帖子
    const gotoDetailPost = () => {
        // 保存数据到sessionStorage中
        sessionStorage.setItem('detailPostState',
            JSON.stringify(
                {
                    postId,
                    postAuthor,
                    postTime,
                    postContent
                }
            )
        )
    }


    React.useEffect(() => {
        // 获取本帖子的图片
        axios.get(`http://${localhost}:8080/picture?postId=${props.post.postId}`).then(
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
        // 若没有这个likedPostsId，则为用户本地存储加上
        let likedPostsId = localStorage.getItem("likedPostsId")
        if (!likedPostsId) {
            localStorage.setItem("likedPostsId", JSON.stringify([]))
        } else {
            // 若在likedPostsId 中发现了这个帖子的Id，说明用户已经点过赞了
            let arr = JSON.parse(likedPostsId)
            // 本帖在localStorage中的位置
            let index = -1
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === postId) {
                    index = i
                    break
                }
            }
            if (index >= 0) {
                setIsLiked(true)
            }
        }

        return () => {
            pubSubId.map(item => {
                return Pubsub.subscribe(item)
            })
        }
    }, [])

    return (
        <div className="post-wrapper">
            <div className="author-info">
                <Avatar
                    size={{xs: 30, sm: 35, md: 40, lg: 45, xl: 50, xxl: 55}}
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
                <div className="post-text" onClick={gotoDetailPost}>
                    <Link to={'/detailPost'}>
                        <Paragraph>
                            {postContent}
                        </Paragraph>
                    </Link>
                </div>
                <Row className="post-picture">
                    {
                        picturesPath && picturesPath.length !== 0 ? picturesPath.map((picturePath, index) => {
                            if (index >= 2) {
                                return;
                            }
                            return <Col className="col" key={index} style={{backgroundImage: `url(${picturePath})`}}>
                                <Image
                                    className="image"
                                    src={picturePath}
                                    placeholder={true}/>
                                {
                                    picturesPath.length > 2 && index >= 1 ?
                                        <div className="extra-picture" onClick={gotoDetailPost}>
                                            <Link to={'/detailPost'}>
                                                <span>+</span>{picturesPath.length - 2}
                                            </Link>
                                        </div> : null
                                }
                            </Col>
                        }) : ""
                    }
                </Row>
                <div className="post-bottom">
                    <a onClick={liked}>
                        {
                            isLiked ? <i className="iconfont icon-dianzan1"/> :
                                <i className="iconfont icon-dianzan"/>
                        }
                        {
                            likedCount ? likedCount : <span>点赞</span>
                        }
                    </a>
                    <a onClick={comment}>
                        <i className="iconfont icon-pinglun"/>
                        {
                            commentCount ? commentCount : <span>评论</span>
                        }
                    </a>
                </div>
                <div className="comment" style={{display: `${showComment ? "" : "none"}`}}>
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
                    {/*所有评论组件*/}
                    <AllComments
                        className="allComments"
                        postId={postId} postAuthor={postAuthor}
                        commentCount={commentCount}
                        isShowViewMore={true}
                        gotoDetailPost={gotoDetailPost}
                    />
                </div>

            </div>
        </div>
    );
}


export default connect(
    state => ({state}),
    {
        add: addCommentIdAction,
        remove: removeCommentIdAction
    }
)(Post)
