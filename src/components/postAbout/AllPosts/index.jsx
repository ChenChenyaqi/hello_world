import React, {useState} from 'react';
import PubSub from 'pubsub-js'
import Post from "../Post";
import axios from "axios";
import localhost from "../../../utils/localhost";
import GetMoreButton from "../../functionModuleAbout/GetMoreButton";
import {postStep} from "../../../utils/getDataStep";
import Loading from "../../functionModuleAbout/Loading";
import {message} from "antd";

const AllPosts = () => {

    // 初始化posts(所有帖子)为空
    const [posts, setPosts] = useState(null)
    // 是否正在加载
    const [isLoading, setIsLoading] = useState(true)
    // 分批请求起点
    const [start, setStart] = useState(0)

    const getMore = () => {
        axios.get(`http://${localhost}:8080/post?start=${start}&step=${postStep}`).then(
            response => {
                const postList = response.data.posts
                if (postList.length === 0) {
                    message.info("没有更多了...")
                } else {
                    let newPosts = postList
                    setPosts(() => {
                        setIsLoading(false)
                        setStart(start + postStep)
                        return [
                            ...posts,
                            ...newPosts
                        ]
                    })
                }
            })
    }

    React.useEffect(() => {
        // 当发布一个帖子时，把新发的帖子传入posts中
        PubSub.subscribe("postPublish", (_, postObj) => {
            setPosts((posts) => [postObj, ...posts])
        })
        // 分批请求帖子
        axios.get(`http://${localhost}:8080/post?start=0&step=${postStep}`).then(
            response => {
                if (response.data.msg) {
                    console.log("帖子为空！")
                } else {
                    let allPosts = response.data.posts
                    setPosts(() => {
                        setIsLoading(false)
                        setStart(start + postStep)
                        return allPosts
                    })
                }
            })
    }, [])


    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {
                isLoading ? <Loading isLoading={isLoading}/> : posts.map((post) => {
                    return <Post key={post.postId} post={post}/>
                })
            }
            {
                isLoading ? null : <GetMoreButton getMore={getMore} isLoading={isLoading}/>
            }
        </div>
    )
}

export default AllPosts;
