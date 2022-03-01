import React, {useState} from 'react';
import { Form, Button, Input } from 'antd';
import CheckPermissions from "../../../utils/CheckPermissions";
import {nanoid} from "nanoid";
import axios from "axios";
import localhost from "../../../utils/localhost";
import Pubsub from "pubsub-js";
import store from "../../../redux/store";

const { TextArea } = Input;

// 回复框
const EditReply = ({ replyTo, postId }) => {

    const [value, setValue] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const onChange = (e) => {
        setValue(e.target.value)
    }

    const onSubmit = () => {
        CheckPermissions("请先登录！")
        if (!value) {
            return;
        }
        if(!localStorage.getItem("token")){
            return;
        }
        setSubmitting(true)
        // 创建评论数据
        const newComment = {
            commentId: nanoid(),
            commentPostId: postId,
            commentAuthor: localStorage.getItem("username"),
            commentReplyAuthor: '@' + replyTo,
            commentContent: value,
            commentTime: Date.now().toString(),
            commentLike: 0,
            commentDislike: 0
        }
        // 保存到服务器
        axios.post(`http://${localhost}:8080/comment/save`, newComment, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            response => {
                setSubmitting(false)
                setValue('')
                Pubsub.publish('newComment',newComment)
                store.dispatch({type:'remove'})
            }
        )
    }


    return (
        <>
            <Form.Item>
                <TextArea
                    maxLength={120}
                    autoSize={{minRows: 1, maxRows: 2}}
                    onChange={onChange}
                    value={value}
                    placeholder={`回复@ ${replyTo} :`}
                    style={{width:'80%'}}
                />
                <Button
                    style={{marginLeft:'5px'}}
                    htmlType="submit"
                    loading={submitting}
                    onClick={onSubmit}
                    type="primary"
                >
                    回复
                </Button>
            </Form.Item>
        </>
    )
}

export default EditReply;
