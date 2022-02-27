import React, {useState} from 'react';
import './index.css'
import axios from "axios";
import Pubsub from 'pubsub-js'
import localhost from "../../../utils/localhost";
import MyComment from "../MyComment";

const PostComment = (props) => {

    // 获取此帖子下所有评论
    const {postId} = props
    // 此贴评论
    const [commentList, setCommentList] = useState([])

    React.useEffect(() => {
        // 根据postId 查找此贴下的所有评论
        axios.get(`http://${localhost}:8080/comment?postId=${postId}`,).then(
            response => {
                setCommentList(response.data)
            }
        )
        // 订阅得到新发的评论
        Pubsub.subscribe('newComment',(_,newComment) => {
            setCommentList((commentList)=>{
                return [
                    newComment,
                    ...commentList
                ]
            })
        })
    }, [])

    return (
        <div className="comment-wrapper">
            {
                commentList.map((comment) => {
                    return <MyComment key={comment.commentId} comment={comment}/>
                })
            }
        </div>
    )
}

export default PostComment;
