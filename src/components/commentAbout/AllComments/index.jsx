import React, {useState} from 'react';
import './index.css'
import axios from "axios";
import Pubsub from 'pubsub-js'
import localhost from "../../../utils/localhost";
import MyComment from '../../../containers/MyComment'
import Loading from "../../functionModuleAbout/Loading";
import {commentStep} from "../../../utils/getDataStep";
import GetMoreButton from "../../functionModuleAbout/GetMoreButton";
import {message, Empty, Divider} from "antd";
import store from "../../../redux/store";

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
    // 加载更多提示
    const [getMoreMsg, setGetMoreMsg] = useState("")

    const getMore = () => {
        setIsLoading(true)
        axios.get(`http://${localhost}:8080/comment?postId=${postId}&start=${start}&step=${commentStep}`,).then(
            response => {
                if (response.data.length === 0) {
                    setGetMoreMsg("暂无更多...")
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
                    return <div key={comment.commentId}>
                        <MyComment comment={comment} postId={postId}
                                   postAuthor={postAuthor}/>
                        <Divider style={{margin: '-5px 0px'}}/>
                    </div>
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
                                <div style={{marginBottom: '10px'}}>
                                    <GetMoreButton isLoading={isLoading} getMore={getMore} msg={getMoreMsg}/>
                                </div>
                        }
                    </>
            }
        </div>
    )
}

export default AllComments;
