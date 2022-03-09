import React, {useState} from 'react';
import './index.css'
import axios from "axios";
import Pubsub from 'pubsub-js'
import localhost from "../../../utils/localhost";
import MyComment from '../../../containers/MyComment'
import Loading from "../../functionModuleAbout/Loading";
import {commentStep} from "../../../utils/getDataStep";
import {Empty, Divider} from "antd";
import GetMoreButton from "../../functionModuleAbout/GetMoreButton";

const AllComments = (props) => {
    // 获取此帖子下所有评论
    const {postId, postAuthor, commentCount,
        isShowViewMore, gotoDetailPost} = props
    // 此贴评论
    const [commentList, setCommentList] = useState([])
    // 是否正在请求所有评论
    const [isGettingComments, setIsGettingComments] = useState(false)
    // 分批请求评论起始点
    const [start, setStart] = useState(0)
    // 是否正在加载更多
    const [isGetMore, setIsGetMore] = useState(false)
    // 加载信息
    const [getMoreMsg, setGetMoreMsg] = useState("")
    //
    const [commentPostId, setCommentPostId] = useState(null)

    const getMore = () => {
        setIsGetMore(true)
        axios.get(`http://${localhost}:8080/comment?postId=${commentPostId}&start=${start}&step=${commentStep}`).then(
            response => {
                const comments = response.data
                if (comments.length === 0) {
                    setIsGetMore(false)
                    setGetMoreMsg("没有更多了...")
                } else {
                    setCommentList(() => {
                        setIsGetMore(false)
                        setStart(start + commentStep)
                        return [
                            ...commentList,
                            ...comments
                        ]
                    })
                }
            })
    }

    React.useEffect(() => {
        // 根据postId 查找此贴下的所有评论
        Pubsub.subscribe('showComment', (_, {isGetComment, commentPostId}) => {
            if (isGetComment && commentPostId === postId) {
                setIsGettingComments(true)
                setCommentPostId(commentPostId)
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
                                } imageStyle={{height: 40}}/> :
                                <>
                                    {
                                        commentCount > commentStep && isShowViewMore ?
                                            <div className="viewMore" onClick={gotoDetailPost}>
                                                查看更多
                                            </div> : <GetMoreButton
                                                getMore={getMore}
                                                isLoading={isGetMore}
                                                msg={getMoreMsg}
                                                caller={"AllPosts"}
                                            />
                                        }
                                </>
                        }
                    </>
            }
        </div>
    )
}

export default AllComments;
