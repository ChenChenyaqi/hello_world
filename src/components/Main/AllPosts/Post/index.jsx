import React from 'react';
import {Avatar, Typography, Image} from 'antd';
import {AntDesignOutlined} from '@ant-design/icons';
import './index.css'
import {timestampToTime} from '../../../../utils/timeUtils'
import axios from "axios";
import localhost from "../../../../utils/localhost";

const {Paragraph} = Typography

const Post = (props) => {
    // console.log("##",props.post)
    const postAuthor = props.post.postAuthor
    const postTime = props.post.postTime
    const postContent = props.post.postContent
    // 处理时间
    const time = timestampToTime(postTime)
    // 本帖子所有图片路径
    const [picturesPath, setPicturesPath] = React.useState(null)

    React.useEffect(() => {
        axios.get(`http://${localhost}:8080/picture/getAll?postId=${props.post.postId}`).then(
            response => {
                if (response.data.length !== 0) {
                    for (let k = 0; k < response.data.length; k++) {
                        setPicturesPath(response.data)
                    }
                }
            }
        )
    }, [])

    return (
        <div className="post-wrapper">
            <div className="author-info">
                <Avatar
                    size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 40, xxl: 100}}
                    icon={<AntDesignOutlined/>}
                />
                <div className="author-detail">
                    <div className="author-name">
                        {postAuthor}
                    </div>
                    <div className="author-time">
                        {time}
                    </div>
                </div>
            </div>
            <div className="post-content">
                <div className="post-text">
                    <Paragraph>
                        {postContent}
                    </Paragraph>
                </div>
                <div className="post-picture">
                    {
                        picturesPath && picturesPath.length !== 0 ? picturesPath.map((picturePath, index) => {
                            return <Image key={index}
                                          width={200}
                                          src={picturePath}
                            />
                        }) : ""
                    }

                </div>
                <div style={{height: '20px'}}>

                </div>
                <div className="post-comment">
                    {/*<PostComment/>*/}
                </div>
            </div>
        </div>
    );
}

export default Post;