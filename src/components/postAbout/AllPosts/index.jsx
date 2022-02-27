import React from 'react';
import PubSub from 'pubsub-js'
import Post from "../Post";
import axios from "axios";
import localhost from "../../../utils/localhost";
import UpdateButton from "../../functionModuleAbout/UpdateButton";

const AllPosts = () => {

    // 初始化posts(所有帖子)为空
    const [posts, setPosts] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        // 当发布一个帖子时，把新发的帖子传入posts中
        PubSub.subscribe("postPublish", (_, postObj) => {
            setPosts((posts) => [postObj, ...posts])
        })
        // 点击加载更多后，把新请求的post加入到posts中
        PubSub.subscribe('pushNewPosts', (_, newPosts) => {
            setPosts((oldPosts) => [...oldPosts, ...newPosts])
        })
        // 请求所有帖子
        axios.get(`http://${localhost}:8080/post/getAll`, {
            headers: {
                start: 0,
                step: 10
            }
        }).then(response => {
            if (response.data.msg) {
                console.log("帖子为空！")
            } else {
                let allPosts = response.data.posts
                setPosts(() => {
                    setIsLoading(false)
                    return allPosts
                })
            }
        })
    }, [])


    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {
                isLoading ? <h1>Loading...</h1> : posts.map((post) => {
                    return <Post key={post.postId} post={post}/>
                })
            }
            {
                isLoading ? null : <UpdateButton/>
            }
        </div>
    )
}

export default AllPosts;
