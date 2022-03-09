import React, {Component} from 'react';
import './index.css'
import {AntDesignOutlined} from "@ant-design/icons";
import {Avatar, Row, Col, Image} from "antd";
import AllComments from "../../commentAbout/AllComments";
import Pubsub from "pubsub-js";

class Detail extends Component {

    state = {
        isLiked: false,
    }

    componentDidMount() {
        const {postId} = JSON.parse(sessionStorage.getItem("detailPostState"))
        Pubsub.publish('showComment', {isGetComment: true, commentPostId: postId})
    }

    render() {
        // 从sessionStorage中获取数据
        const {
            postId, postAuthor,
            postContent, postTime,
            picturesPath, likedCount,
            commentCount
        } = JSON.parse(sessionStorage.getItem("detailPostState"))
        const {isLiked} = this.state
        return (
            <div className="detail-post wrapper">
                <div className="post-header">
                    <div className="author-photo">
                        <Avatar
                            size={{xs: 30, sm: 35, md: 40, lg: 45, xl: 50, xxl: 55}}
                            icon={<AntDesignOutlined/>}
                        />
                    </div>
                    <div className="post-info">
                        <div className="post-author-name">
                            {postAuthor}
                        </div>
                        <div className="post-time">
                            {postTime}
                        </div>
                    </div>
                </div>
                <div className="post-content">
                    <div className="content">
                        {postContent}
                    </div>
                    <Row className="post-picture">
                        {
                            picturesPath && picturesPath.length !== 0 ? picturesPath.map((picturePath, index) => {
                                return <Col
                                    xs={8} sm={8} md={4} lg={4} xl={4}
                                    key={index}>
                                        <Image
                                            height={'100%'}
                                            src={picturePath}
                                            placeholder={true}/>
                                </Col>
                            }) : ""
                        }
                    </Row>
                </div>
                <div className="post-footer">
                    <a>
                        {
                            isLiked ? <i className="iconfont icon-dianzan1"/> :
                                <i className="iconfont icon-dianzan"/>
                        }
                        {
                            likedCount ? likedCount : <span>点赞</span>
                        }
                    </a>
                    <a>
                        <i className="iconfont icon-pinglun"/>
                        {
                            commentCount ? commentCount : <span>评论</span>
                        }
                    </a>
                </div>
                <div className="comment-sort">
                    <span>按时间排序</span>
                </div>
                <div className="divider"/>
                <div className="post-comments">
                    <AllComments postId={postId}
                                 postAuthor={postAuthor}
                                 commentCount={commentCount}
                                 isShowViewMore={false}/>
                </div>
            </div>
        );
    }
}

export default Detail;
