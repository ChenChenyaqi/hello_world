import React, {createElement, useEffect, useState} from 'react';
import {Avatar, Comment, message, Tooltip} from "antd";
import {AntDesignOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@ant-design/icons";
import moment from "moment";
import './index.css'
import store from "../../redux/store";
// 引入connect用于连接UI组件和redux
import {connect} from 'react-redux'
import axios from "axios";
import localhost from "../../utils/localhost";
import EditReply from "../../components/commentAbout/EditReply";
import {addCurrentReplyIdAction, removeCurrentReplyIdAction} from "../../redux/actions/currentReply";
import MyAvatar from "../../components/userAbout/MyAvatar";

const MyReply = ({replyObj, state, add, remove, commentAuthor, commentId}) => {
    const {replyId, replyContent, replyAuthor, replyReplyUser,
        replyTime, replyLike, replyDislike} = replyObj

    // 点赞量、点踩量
    const [likeCount, setLikeCount] = useState(replyLike)
    const [dislikeCount, setDislikeCount] = useState(replyDislike)
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
    // 本回复作者头像
    const [replyAuthorAvatar,setReplyAuthorAvatar] = useState('')

    // 点赞时
    const like = () => {
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        if(!likedFlag){
            setAction('liked');
            setLikedFlag(true)
            setDislikedFlag(false)
            // 更新点赞列表
            const newLikeArray = [...likeArray]
            newLikeArray.push(username)
            setLikeArray(newLikeArray)
            const newDislikeArray = [...dislikeArray]
            if(newDislikeArray.includes(username)){
                newDislikeArray.splice(newDislikeArray.indexOf(username),1)
                setDislikeArray(newDislikeArray)
                axios.get(`http://${localhost}:8080/reply/update/dislikedArray?dislikedArray=${newDislikeArray.join(',')}&replyId=${replyId}`).then()
            }
            axios.get(`http://${localhost}:8080/reply/update/likedArray?likedArray=${newLikeArray.join(',')}&replyId=${replyId}`).then()
            // 发送请求，点赞
            axios.get(`http://${localhost}:8080/reply/like?replyId=${replyId}`).then(
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
        if(!dislikedFlag){
            setAction('disliked');
            setDislikedFlag(true);
            setLikedFlag(false);
            // 更新点踩列表
            const newDislikeArray = [...dislikeArray]
            newDislikeArray.push(username)
            setDislikeArray(newDislikeArray)
            const newLikeArray = [...likeArray]
            if(newLikeArray.includes(username)){
                newLikeArray.splice(newLikeArray.indexOf(username),1)
                setLikeArray(newLikeArray)
                axios.get(`http://${localhost}:8080/reply/update/likedArray?likedArray=${newLikeArray.join(',')}&replyId=${replyId}`).then()
            }
            axios.get(`http://${localhost}:8080/reply/update/dislikedArray?dislikedArray=${newDislikeArray.join(',')}&replyId=${replyId}`).then()
            // 发送请求，点踩
            axios.get(`http://${localhost}:8080/reply/dislike?replyId=${replyId}`).then(
                response => {
                    if (likeCount > 0) {
                        setLikeCount(likeCount - 1)
                    }
                }
            )
        }
    };

    // 回复
    const reply = () => {
        if (!store.getState().permission) {
            return message.warn('请先登录！')
        }
        if (state.currentReplyId === replyId) {
            remove()
        } else {
            add(replyId)
        }
    }

    useEffect(() => {
        // 获取回复作者头像
        axios.get(`http://${localhost}:8080/user/avatar?username=${replyAuthor}`).then(
            response => {
                setReplyAuthorAvatar(response.data)
            }
        )
        // 获取此评论点赞与点踩用户数组
        axios.get(`http://${localhost}:8080/reply/likeAndDislikeArray?replyId=${replyId}`).then(
            response => {
                const likedStr = response.data[0];
                const dislikedStr = response.data[1];
                if(likedStr){
                    const likedArray = likedStr.split(',');
                    if(likedArray.includes(username)){
                        setAction('liked')
                        setLikedFlag(true)
                    }
                    setLikeArray(likedArray);
                }
                if(dislikedStr){
                    const dislikedArray = dislikedStr.split(',');
                    if(dislikedArray.includes(username)){
                        setAction('disliked')
                        setDislikedFlag(true)
                    }
                    setDislikeArray(dislikedArray);
                }
            }
        )
    },[])

    return (
        <div>
            <Comment
                key={replyId}
                actions={
                    [
                        <template className="reply">
                            <Tooltip key="comment-basic-like" title="喜欢">
                                    <span onClick={like} className='comment-like'>
                                        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                                        <span className="comment-action">{likeCount}</span>
                                    </span>
                            </Tooltip>
                            <Tooltip key="comment-basic-dislike" title="不喜欢">
                                    <span onClick={dislike} className='comment-dislike'>
                                        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                                    </span>
                            </Tooltip>
                            <span key="comment-basic-reply-to" className="comment-reply" onClick={reply}>回复</span>
                        </template>
                    ]
                }
                author={
                    <a className='comment-author'>{replyReplyUser === commentAuthor ? replyAuthor : `${replyAuthor} 回复：${replyReplyUser}`}</a>}
                avatar={<MyAvatar username={replyAuthor} bgcolor={'#ffbf00'} url={replyAuthorAvatar}/>}
                content={
                    <p className='comment-content'>
                        {replyContent}
                    </p>
                }
                datetime={
                    <Tooltip title={moment(parseInt(replyTime)).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(parseInt(replyTime)).fromNow()}</span>
                    </Tooltip>
                }
            />
            {
                state.currentReplyId === replyId ?
                    <EditReply replyTo={replyAuthor} commentId={commentId} action={"reply"}/> : null
            }
        </div>
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
)(MyReply)
