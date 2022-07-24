import React from 'react';
import './index.css'
import {Link} from "react-router-dom";

const SimpleAllReply = ({replyList, commentAuthor, postId, postAuthor,
                            postTime, postContent}) => {

    const getMore = () => {
        // 保存数据到sessionStorage中
        sessionStorage.setItem('detailPostState',
            JSON.stringify(
                {
                    postId,
                    postAuthor,
                    postTime,
                    postContent
                }
            )
        )
    }

    return (
        <div className="simpleReply-wrapper">
            {
                replyList.map(reply => {
                    return <div key={reply.replyId} className="simpleReply">
                        <span>{reply.replyReplyUser === commentAuthor ? reply.replyAuthor + '：' : `${reply.replyAuthor} 回复：${reply.replyReplyUser}：`}</span>
                        <p>{reply.replyContent}</p>
                    </div>
                })
            }
            {
                replyList.length > 3 ? <div className="getMore" onClick={getMore}>
                    <Link to={`/detailPost/${postId}`} className="link">查看更多回复</Link>
                </div> : null
            }
        </div>
    );
}

export default SimpleAllReply;
