import React, {createElement, useEffect, useState} from 'react';
import {Avatar, Comment, message, Tooltip} from "antd";
import {AntDesignOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import localhost from "../../utils/localhost";
import EditReply from "../../components/commentAbout/EditReply";
// 引入connect用于连接UI组件和redux
import {connect} from 'react-redux'
import './index.css'
import store from "../../redux/store";
import AllReply from "../../components/replyAbout/AllReply";
import Pubsub from 'pubsub-js'
import {replyStep} from "../../utils/getDataStep";
import {addCurrentReplyIdAction, removeCurrentReplyIdAction} from "../../redux/actions/currentReply";
import SimpleAllReply from "../../components/replyAbout/SimpleAllReply";
import MyAvatar from "../../components/userAbout/MyAvatar";

// 定义UI组件
const MyComment = (props) => {
    // 得到评论有关信息
    const {
        commentId, commentAuthor, commentContent, commentTime,
        commentLike, commentDisLike
    } = props.comment

    // state、add、remove是容器组件传来的状态和操作状态的方法
    const {
        state, add, remove, showSimpleReplyList,
        postId, postAuthor,
        postTime, postContent,
    } = props

    // 评论喜欢数
    const [likeCount, setLikeCount] = useState(commentLike)
    // 不喜欢数
    const [dislikeCount, setDislikeCount] = useState(commentDisLike)
    // 点赞用户列表
    const [likeArray, setLikeArray] = useState([])
    // 点踩用户列表
    const [dislikeArray, setDislikeArray] = useState([])
    // 是点赞还是点踩
    const [action, setAction] = useState(null);
    // 是否已经点过赞/踩
    const [likedFlag, setLikedFlag] = useState(false);
    const [dislikedFlag, setDislikedFlag] = useState(false);
    // 当前用户
    const username = localStorage.getItem("username")
    // 本评论作者头像
    const [commentAuthorAvatar,setCommentAuthorAvatar] = useState('')

    // 此评论下的所有回复
    const [replyList, setReplyList] = useState(null)


    // 点赞时
    const like = () => {
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        if (!likedFlag) {
            setAction('liked');
            setLikedFlag(true)
            setDislikedFlag(false)
            // 更新点赞列表
            const newLikeArray = [...likeArray]
            newLikeArray.push(username)
            setLikeArray(newLikeArray)
            const newDislikeArray = [...dislikeArray]
            if (newDislikeArray.includes(username)) {
                newDislikeArray.splice(newDislikeArray.indexOf(username), 1)
                setDislikeArray(newDislikeArray)
                axios.get(`http://${localhost}:8080/comment/update/dislikedArray?dislikedArray=${newDislikeArray.join(',')}&commentId=${commentId}`).then()
            }
            axios.get(`http://${localhost}:8080/comment/update/likedArray?likedArray=${newLikeArray.join(',')}&commentId=${commentId}`).then()
            // 发送请求，点赞
            axios.get(`http://${localhost}:8080/comment/like?commentId=${commentId}`).then(
                response => {
                    setLikeCount(likeCount + 1)
                    if (dislikeCount > 0) {
                        setDislikeCount(dislikeCount - 1)
                    }
                }
            )
        }
    };

    // 点踩时
    const dislike = () => {
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        if (!dislikedFlag) {
            setAction('disliked');
            setDislikedFlag(true);
            setLikedFlag(false);
            // 更新点踩列表
            const newDislikeArray = [...dislikeArray]
            newDislikeArray.push(username)
            setDislikeArray(newDislikeArray)
            const newLikeArray = [...likeArray]
            if (newLikeArray.includes(username)) {
                newLikeArray.splice(newLikeArray.indexOf(username), 1)
                setLikeArray(newLikeArray)
                axios.get(`http://${localhost}:8080/comment/update/likedArray?likedArray=${newLikeArray.join(',')}&commentId=${commentId}`).then()
            }
            axios.get(`http://${localhost}:8080/comment/update/dislikedArray?dislikedArray=${newDislikeArray.join(',')}&commentId=${commentId}`).then()
            // 发送请求，点踩
            axios.get(`http://${localhost}:8080/comment/dislike?commentId=${commentId}`).then(
                response => {
                    if (likeCount > 0) {
                        setLikeCount(likeCount - 1)
                    }
                }
            )
        }
    };

    // 点击回复时
    const reply = () => {
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        if (state.currentReplyId === commentId) {
            remove()
        } else {
            add(commentId)
        }
    }

    // 获取评论下的回复
    const getReplyList = (start, step) => {
        axios.get(`http://${localhost}:8080/reply?commentId=${commentId}&start=${start}&step=${step}`).then(
            response => {
                if (response.data && response.data.length) {
                    setReplyList(response.data)
                }
            }
        )
    }

    useEffect(() => {
        // 获取本评论用户头像
        axios.get(`http://${localhost}:8080/user/avatar?username=${commentAuthor}`).then(
            response => {
                setCommentAuthorAvatar(response.data)
            }
        )
        // 获取此评论点赞与点踩用户数组
        axios.get(`http://${localhost}:8080/comment/likeAndDislikeArray?commentId=${commentId}`).then(
            response => {
                const likedStr = response.data[0];
                const dislikedStr = response.data[1];
                if (likedStr) {
                    const likedArray = likedStr.split(',');
                    if (likedArray.includes(username)) {
                        setAction('liked')
                        setLikedFlag(true)
                    }
                    setLikeArray(likedArray);
                }
                if (dislikedStr) {
                    const dislikedArray = dislikedStr.split(',');

                    if (dislikedArray.includes(username)) {
                        setAction('disliked')
                        setDislikedFlag(true)
                    }
                    setDislikeArray(dislikedArray);
                }
            }
        )
        // 获取此评论下的回复
        getReplyList(0, replyStep)

        Pubsub.subscribe('newReply', (_, data) => {
            // 获取此评论下的回复
            getReplyList(0, replyStep)
        })

    }, [])


    return (
        <>
            <Comment
                key={commentId}
                actions={
                    [
                        <Tooltip key="comment-basic-like" title="喜欢">
                                    <span onClick={like} className='comment-like'>
                                        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                                        <span className="comment-action">{likeCount}</span>
                                    </span>
                        </Tooltip>,
                        <Tooltip key="comment-basic-dislike" title="不喜欢">
                                    <span onClick={dislike} className='comment-dislike'>
                                        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                                        <span className="comment-action">{dislikeCount}</span>
                                    </span>
                        </Tooltip>,
                        <span key="comment-basic-reply-to" className="comment-reply" onClick={reply}>回复</span>
                    ]
                }
                author={
                    <a className='comment-author'>{commentAuthor}</a>}
                avatar={<MyAvatar username={commentAuthor} bgcolor={'#00a2ae'} url={commentAuthorAvatar}/>}
                content={
                    <p className='comment-content'>
                        {commentContent}
                    </p>
                }
                datetime={
                    <Tooltip title={moment(parseInt(commentTime)).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(parseInt(commentTime)).fromNow()}</span>
                    </Tooltip>
                }
            />
            {
                replyList && replyList.length ?
                    <>
                        {
                            showSimpleReplyList ?
                                <SimpleAllReply commentAuthor={commentAuthor} replyList={replyList} postId={postId} postAuthor={postAuthor}
                                                postTime={postTime} postContent={postContent}/> :
                                <AllReply replyCommentId={commentId} commentId={commentId}
                                          commentAuthor={commentAuthor}/>
                        }
                    </>
                    : null
            }
            {
                state.currentReplyId === commentId ?
                    <EditReply replyTo={commentAuthor} commentId={commentId}/> : null
            }
        </>
    );
}


// !!! store不能直接引入，要在AllComments中通过props的形式传入store
// 建立并暴露一个容器组件，建立容器和UI组件的联系
export default connect(
    // mapStateToProps函数的返回的对象中的key就作为传递给UI组件props的key
    state => ({state}),
    // mapDispatchToProps函数的返回的对象作为操作状态的方法
    {
        // 通知redux执行添加操作
        add: addCurrentReplyIdAction,
        remove: removeCurrentReplyIdAction
    }
)(MyComment)

