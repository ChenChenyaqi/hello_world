import React, {createElement, useEffect, useState} from 'react';
import {Avatar, Comment, Tooltip} from "antd";
import {AntDesignOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import localhost from "../../../utils/localhost";
import EditReply from "../EditReply";
import store from "../../../redux/store";

const MyComment = (props) => {

    // 得到评论有关信息
    const {
        commentId, commentPostId, commentAuthor,
        commentReplyAuthor, commentContent, commentTime,
        commentLike, commentDisLike
    } = props.comment

    const {postId,postAuthor} = props

    // 评论喜欢数
    const [likeCount, setLikeCount] = useState(commentLike)
    // 不喜欢数
    const [dislikeCount, setDislikeCount] = useState(commentDisLike)
    // 是点赞还是点踩
    const [action, setAction] = useState(null);
    //
    const [a, setA] = useState(null)

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
        store.dispatch({type: 'add', data: commentId})
    }

    useEffect(() => {
        store.subscribe(() => {
            setA({})
        })
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
                author={<a>{commentReplyAuthor === postAuthor ? commentAuthor : `${commentAuthor} 回复 ${commentReplyAuthor}:`}</a>}
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
                store.getState() === commentId ?
                    <EditReply replyTo={commentAuthor} postId={postId}/> : null
            }
        </>
    );
}

export default MyComment;
