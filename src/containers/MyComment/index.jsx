import React, {createElement, useEffect, useState} from 'react';
import {Avatar, Comment, Tooltip} from "antd";
import {AntDesignOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import localhost from "../../utils/localhost";
import EditReply from "../../components/commentAbout/EditReply";
// 引入connect用于连接UI组件和redux
import {connect} from 'react-redux'
// 引入comment_action
import {addCommentIdAction, removeCommentIdAction} from '../../redux/actions/comment';

// 定义UI组件
const MyComment = (props) => {
    // 得到评论有关信息
    const {
        commentId, commentAuthor,
        commentReplyAuthor, commentContent, commentTime,
        commentLike, commentDisLike
    } = props.comment

    // state、add、remove是容器组件传来的状态和操作状态的方法
    const {postId, postAuthor, state, add, remove} = props

    // 评论喜欢数
    const [likeCount, setLikeCount] = useState(commentLike)
    // 不喜欢数
    const [dislikeCount, setDislikeCount] = useState(commentDisLike)
    // 是点赞还是点踩
    const [action, setAction] = useState(null);

    // 点赞时
    const like = () => {
        setAction('liked');
        let arr1 = JSON.parse(localStorage.getItem("likedComments"))
        arr1.push(commentId)
        localStorage.setItem("likedComments", JSON.stringify(arr1))
        let arr2 = JSON.parse(localStorage.getItem("disLikedComments"))
        for (let i = 0; i < arr2.length; i++) {
            if (arr2[i] === commentId) {
                arr2.splice(i, 1)
            }
        }
        localStorage.setItem("disLikedComments", JSON.stringify(arr2))
        // 发送请求，点赞
        axios.get(`http://${localhost}:8080/comment/like?commentId=${commentId}`).then(
            response => {
                setLikeCount(likeCount + 1)
                if (dislikeCount > 0) {
                    setDislikeCount(dislikeCount - 1)
                }
            }
        )
    };

    // 点踩时
    const dislike = () => {
        setAction('disliked');
        let arr1 = JSON.parse(localStorage.getItem("disLikedComments"))
        arr1.push(commentId)
        localStorage.setItem("disLikedComments", JSON.stringify(arr1))
        let arr2 = JSON.parse(localStorage.getItem("likedComments"))
        for (let i = 0; i < arr2.length; i++) {
            if (arr2[i] === commentId) {
                arr2.splice(i, 1)
            }
        }
        localStorage.setItem("likedComments", JSON.stringify(arr2))
        // 发送请求，点踩
        axios.get(`http://${localhost}:8080/comment/dislike?commentId=${commentId}`).then(
            response => {
                if (likeCount > 0) {
                    setLikeCount(likeCount - 1)
                }
            }
        )
    };

    // 点击回复时
    const reply = () => {
        if (state.commentId === commentId) {
            remove()
        } else {
            add(commentId)
        }
    }

    useEffect(() => {
        // 若没有点赞/点踩数据，则加上
        let likedComments = localStorage.getItem("likedComments")
        if (!likedComments) {
            localStorage.setItem("likedComments", JSON.stringify([]))
        } else {
            let arr = JSON.parse(likedComments)
            let index = -1
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === commentId) {
                    index = i
                    break
                }
            }
            if (index >= 0) {
                setAction("liked")
            }
        }
        let disLikedComments = localStorage.getItem("disLikedComments")
        if (!disLikedComments) {
            localStorage.setItem("disLikedComments", JSON.stringify([]))
        } else {
            let arr = JSON.parse(disLikedComments)
            let index = -1
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === commentId) {
                    index = i
                    break
                }
            }
            if (index >= 0) {
                setAction("disliked")
            }
        }
    }, [])

    return (
        <>
            <Comment
                key={commentId}
                actions={
                    [
                        <Tooltip key="comment-basic-like" title="喜欢">
                                    <span onClick={like}>
                                        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                                        <span className="comment-action">{likeCount}</span>
                                    </span>
                        </Tooltip>,
                        <Tooltip key="comment-basic-dislike" title="不喜欢">
                                    <span onClick={dislike}>
                                        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                                        <span className="comment-action">{dislikeCount}</span>
                                    </span>
                        </Tooltip>,
                        <span key="comment-basic-reply-to" onClick={reply}>回复</span>
                    ]
                }
                author={
                    <a>{commentReplyAuthor === postAuthor ? commentAuthor : `${commentAuthor} 回复 ${commentReplyAuthor}:`}</a>}
                avatar={<Avatar>icon={<AntDesignOutlined/>}</Avatar>}
                content={
                    <p>
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
                state.commentId === commentId ?
                    <EditReply replyTo={commentAuthor} postId={postId}/> : null
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
        add: addCommentIdAction,
        remove: removeCommentIdAction
    }
)(MyComment)

