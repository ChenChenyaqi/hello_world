import React, {useState} from 'react';
import {Avatar, Typography, Image, Comment, Row, Col, message} from 'antd';
import {AntDesignOutlined} from '@ant-design/icons';
import './index.css'
import {timestampToTime} from '../../utils/timeUtils'
import axios from "axios";
import localhost from "../../utils/localhost";
import AllComments from "../../components/commentAbout/AllComments";
import EditComment from "../../components/commentAbout/EditComment";
import Pubsub from 'pubsub-js'
import {nanoid} from "nanoid";
import {connect} from "react-redux";
import {addCommentIdAction, removeCommentIdAction} from "../../redux/actions/comment";
import {Link, withRouter} from "react-router-dom";
import store from "../../redux/store";

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
    // 点赞人员列表
    const [likedArray, setLikedArray] = useState([])
    // 是否展示评论区
    const [showComment, setShowComment] = useState(false)
    // 控制回复框相关
    const [submitting, setSubmitting] = useState(false)
    const [value, setValue] = useState('')
    // 当前用户名
    const username = localStorage.getItem("username")

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
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        if (!value.trim()) {
            return message.info('请输入内容！');
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
                <div className="post-text">
                    <Link to={`/detailPost/${postId}`}>
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
                                        <div className="extra-picture">
                                            <Link to={`/detailPost/${postId}`}>
                                                <span>+{picturesPath.length - 2}</span>
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
                        postTime={postTime} postContent={postContent}
                        commentCount={commentCount}
                        isShowViewMore={true}
                        showSimpleReplyList={true}
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
)(withRouter(Post))
