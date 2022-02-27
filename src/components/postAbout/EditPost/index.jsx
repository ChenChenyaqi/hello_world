import React, {useState} from 'react';
import {Input, Button, message, Upload} from 'antd';
import {UploadOutlined} from "@ant-design/icons"
import {nanoid} from 'nanoid'
import PubSub from 'pubsub-js'
import {withRouter} from 'react-router-dom'

import './index.css'
import CheckPermissions from "../../../utils/CheckPermissions";
import axios from "axios";
import localhost from "../../../utils/localhost";

const {TextArea} = Input;

// 编辑帖子组件
const EditPost = (Props) => {
    // 帖子内容
    const [value, setValue] = useState("")
    // 是否展示上传文件列表
    let [showFileList, setShowFileList] = useState(0)
    let fileListLength = null

    // 自动获取帖子内容
    const onChange = ({target: {value}}) => {
        setValue(value)
    };

    // 点击发布帖子时
    const publishPost = () => {
        // 先检查权限
        CheckPermissions('请先登录！')
        // 没有token则拒绝发帖
        if (!localStorage.getItem("token")) {
            return ""
        }
        if (value === "" || value.trim() === "") {
            message.warning('内容不能为空！');
            return ""
        }
        setShowFileList((showFileList) => showFileList + 1)
        // 准备帖子数据
        const postId = nanoid()
        const postContent = value
        const postTime = Date.now()
        const postAuthor = localStorage.getItem("username")
        const postLike = 0
        const postDislike = 0
        const postObj = {postId, postContent, postTime, postAuthor, postLike, postDislike}
        const dataObj = JSON.stringify(postObj)

        // 保存帖子
        axios.post(`http://${localhost}:8080/post/save`,
            dataObj,
            {headers: {"Content-Type": "application/json"}}).then(
            response => {
                // 清空输入框内容
                setValue("")
                Props.history.replace("/")
                // 发送post给AllPosts组件
                PubSub.publish("postPublish", postObj)
            }
        )
    }


    const props = {
        name: 'file',
        accept: ".png, .jpg, .jpeg",
        action: `http://${localhost}:8080/img/save`,
        headers: {
            contentType: "multipart/form-data",
            username: localStorage.getItem("username")
        },
        maxCount: 3,
        disabled: !localStorage.getItem("token"),
        showUploadList: true,
        beforeUpload: (file, _) => {
            if (fileListLength === props.maxCount) {
                message.error(`限制最大上传图片数：3`);
                return false
            }
            if (file.size > 1024 * 1024 * 5) {
                message.error(`图片大小超过5Mb`);
                return Upload.LIST_IGNORE
            }

            file.uid = nanoid();
            props.headers.pictureId = file.uid;
            props.headers.pictureTime = Date.now()
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
                fileListLength = info.fileList.length
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败，请重试`);
            }
        },
        onRemove(file) {
            axios.get(`http://${localhost}:8080/picture/delete?pictureId=${file.uid}`).then(
                response => {

                }
            )
        }
    };

    // 点击上传图片按钮
    const uploadPicture = () => {
        CheckPermissions("请先登录！")
    }

    return (
        <div className="edit-post">
            <TextArea
                value={value}
                showCount
                maxLength={300}
                onChange={onChange}
                placeholder="分享点什么..."
                autoSize={{minRows: 2, maxRows: 4}}
            />
            <div className="edit-btn" key={showFileList}>
                <Button type="primary" onClick={publishPost}>发布</Button>&nbsp;
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>} onClick={uploadPicture}>点击上传图片</Button>
                </Upload>
            </div>
        </div>
    );
}

export default withRouter(EditPost);
