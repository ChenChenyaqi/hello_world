import React from 'react';
import PubSub from 'pubsub-js'
import Post from "./Post";
import axios from "axios";
import localhost from "../../../utils/localhost";

const AllPosts = () => {

    const [posts, setPosts] = React.useState(null)

    React.useEffect(() => {
        PubSub.subscribe("postPublish", (_, postObj) => {
            setPosts((posts) => [postObj, ...posts])
        })
        axios.get(`http://${localhost}:8080/post/getAll`).then(
            response => {
                if(response.data.msg){
                    console.log("帖子为空！")
                } else {
                    let allPosts = response.data.posts
                    allPosts.sort((a, b) => {
                        return - (parseInt(a.postTime) - parseInt(b.postTime))
                    })
                    setPosts(allPosts)
                }
            }
        )

    },[])

    onwheel = (e) => {
        if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 70){
            if(e.wheelDelta < 0){
                console.log("!!!")
            }
        }
    }

    return (
        <div>
            {
                !posts ? "" : posts.map((post) => {
                    return <Post key={post.postId} post={post}/>
                })
            }
        </div>
    )
}

export default AllPosts;