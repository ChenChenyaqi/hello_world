import React, {useState} from 'react';
import {Form, Button, Input, message} from 'antd';
import {nanoid} from "nanoid";
import axios from "axios";
import localhost from "../../../utils/localhost";
import Pubsub from "pubsub-js";
import store from "../../../redux/store";

const { TextArea } = Input;

// 回复框
const EditReply = ({ replyTo, commentId, action}) => {

    const [value, setValue] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const onChange = (e) => {
        setValue(e.target.value)
    }

    const onSubmit = () => {
        if(!store.getState().permission){
            return message.warn('请先登录！')
        }
        if (!value.trim()) {
            return message.info('请输入内容！');
        }
        setSubmitting(true)
        // 创建回复数据
        const newReply = {
            replyId: nanoid(),
            replyCommentId: commentId,
            replyAuthor: localStorage.getItem("username"),
            replyReplyUser: !action ? replyTo : '@ ' + replyTo,
            replyContent: value,
            replyTime: Date.now().toString(),
            replyLike: 0,
            replyDislike: 0
        }
        // 保存到服务器
        axios.post(`http://${localhost}:8080/reply/save`, newReply, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            response => {
                setSubmitting(false)
                setValue('')
                Pubsub.publish('newReply',newReply)
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
                    autoFocus
                    placeholder={`回复@ ${replyTo} :`}
                    style={{width:'70%', borderRadius:'6px'}}
                />
                <Button
                    style={{marginLeft:'5px', borderRadius:'6px'}}
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
