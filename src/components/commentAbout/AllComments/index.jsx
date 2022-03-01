import React, {useState} from 'react';
import './index.css'
import axios from "axios";
import Pubsub from 'pubsub-js'
import localhost from "../../../utils/localhost";
import MyComment from "../MyComment";
import Loading from "../../functionModuleAbout/Loading";
import {commentStep} from "../../../utils/getDataStep";
import GetMoreButton from "../../functionModuleAbout/GetMoreButton";
import {message, Empty} from "antd";

const AllComments = (props) => {
    // 获取此帖子下所有评论
    const {postId, postAuthor} = props
    // 此贴评论
    const [commentList, setCommentList] = useState([])
    // 是否正在请求所有评论
    const [isGettingComments, setIsGettingComments] = useState(false)
    // 分批请求评论起始点
    const [start, setStart] = useState(0)
    // 是否正在获取更多评论
    const [isLoading, setIsLoading] = useState(false)

    const getMore = () => {
        setIsLoading(true)
        axios.get(`http://${localhost}:8080/comment?postId=${postId}&start=${start}&step=${commentStep}`,).then(
            response => {
                if (response.data.length === 0) {
                    message.info("暂无更多...")
                } else {
                    setStart(start + commentStep)
                    setCommentList([...commentList, ...response.data])
                }
                setIsLoading(false)
            }
        )
    }

    React.useEffect(() => {
        // 根据postId 查找此贴下的所有评论
        Pubsub.subscribe('showComment', (_, {isGetComment, commentPostId}) => {
            if (isGetComment && commentPostId === postId) {
                setIsGettingComments(true)
                axios.get(`http://${localhost}:8080/comment?postId=${commentPostId}&start=0&step=${commentStep}`,).then(
                    response => {
                        setIsGettingComments(false)
                        setStart(start + commentStep)
                        setCommentList(response.data)
                    }
                )
            }
        })
        // 订阅得到新发的评论
        Pubsub.subscribe('newComment', (_, newComment) => {
            axios.get(`http://${localhost}:8080/comment?postId=${postId}&start=0&step=${commentStep}`,).then(
                response => {
                    setCommentList(response.data)
                }
            )
        })
    }, [])

    return (
        <div className="comment-wrapper">
            {
                isGettingComments ? <Loading isLoading={isGettingComments}/> : commentList.map((comment) => {
                    return <MyComment key={comment.commentId} comment={comment} postId={postId}
                                      postAuthor={postAuthor}/>
                })
            }
            {
                isGettingComments ? null :
                    <>
                        {
                            commentList.length === 0 ? <Empty description={
                                    <>
                                        <span style={{fontSize: '13px'}}>暂无评论</span>
                                        <br/>
                                        <br/>
                                    </>
                                }
                                                              imageStyle={{height: 40}}/> :
                                <GetMoreButton isLoading={isLoading} getMore={getMore}/>
                        }
                    </>
            }
        </div>
    )
}

export default AllComments;
