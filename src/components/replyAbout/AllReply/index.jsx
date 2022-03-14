import React, {useEffect, useState} from 'react';
import MyReply from '../../../containers/MyReply'
import Pubsub from 'pubsub-js'
import './index.css'
import axios from "axios";
import localhost from "../../../utils/localhost";
import {Pagination} from "antd";

const AllReply = ({replyCommentId, commentAuthor, commentId}) => {

    const [localReplies, setLocalReplies] = useState(null)
    // 总数
    const [allReplyLength, setAllReplyLength] = useState(0)

    // 每页展示个数
    const numEachPage = 3;

    const getMore = (currentPage) => {
        axios.get(`http://${localhost}:8080/reply?commentId=${commentId}&start=${(currentPage - 1)*numEachPage}&step=${numEachPage}`).then(
            response => {
                setLocalReplies(response.data)
            }
        )
    }

    useEffect(() => {
        axios.get(`http://${localhost}:8080/reply/count?replyCommentId=${replyCommentId}`).then(
            response => {
                setAllReplyLength(response.data)
            }
        )
        axios.get(`http://${localhost}:8080/reply?commentId=${commentId}&start=0&step=${numEachPage}`).then(
            response => {
                setLocalReplies(response.data)
            }
        )
        Pubsub.subscribe('newReply', ()=>{
            axios.get(`http://${localhost}:8080/reply?commentId=${commentId}&start=0&step=${numEachPage}`).then(
                response => {
                    setLocalReplies(response.data)
                }
            )
            axios.get(`http://${localhost}:8080/reply/count?replyCommentId=${replyCommentId}`).then(
                response => {
                    setAllReplyLength(response.data)
                }
            )
        })
    },[])

    return (
        <div className="replies-wrapper">
            <ul>
                {
                    localReplies && localReplies.map(replyObj => {
                        return <li key={replyObj.replyId}>
                            <MyReply replyObj={replyObj} commentAuthor={commentAuthor} commentId={commentId}/>
                        </li>
                    })
                }
            </ul>
            <div className="each-page">
                {
                    allReplyLength > numEachPage ? <>
                        <Pagination simple
                                    hideOnSinglePage
                                    defaultCurrent={1}
                                    defaultPageSize={numEachPage}
                                    total={allReplyLength}
                                    onChange={ (page) => getMore(page)}
                        />
                    </> : null
                }
            </div>
        </div>
    );
}

export default AllReply;
