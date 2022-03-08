import React, {Component} from 'react';
import {Input, Button, message, Upload} from 'antd';
import {nanoid} from 'nanoid'
import PubSub from 'pubsub-js'
import {withRouter} from 'react-router-dom'
import compressImage from "../../../utils/compressImage";
import './index.css'
import CheckPermissions from "../../../utils/CheckPermissions";
import axios from "axios";
import localhost from "../../../utils/localhost";
import PictureOutlined from "@ant-design/icons/lib/icons/PictureOutlined";
import NumberOutlined from "@ant-design/icons/lib/icons/NumberOutlined";

const {TextArea} = Input;
let fileListLength = null
const pubSubId = []

// 编辑帖子组件
class EditPost extends Component {
    state = {
        // 帖子内容
        value: "",
        // 是否展示上传文件列表
        showFileList: 0
    }

    // 自动获取帖子内容
    onChange = ({target: {value}}) => {
        this.setState({value})
    };

    // 点击发布帖子时
    publishPost = () => {
        const {value, showFileList} = this.state
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
        this.setState({showFileList: showFileList + 1})

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
                this.setState({value: ''})
                this.props.history.replace("/")
                // 发送post给AllPosts组件
                const p1 = PubSub.publish("postPublish", postObj)
                pubSubId.push(p1)
            }
        )
    }


    Props = {
        name: 'file',
        accept: ".png, .jpg, .jpeg",
        action: `http://${localhost}:8080/img/save`,
        headers: {
            contentType: "multipart/form-data",
            username: localStorage.getItem("username")
        },
        maxCount: 5,
        disabled: !localStorage.getItem("token"),
        listType: "text",
        beforeUpload: (file, _) => {
            if (fileListLength === this.Props.maxCount) {
                message.error(`限制最大上传图片数：5`);
                return false
            }
            if (file.size > 1024 * 1024 * 5) {
                message.error(`图片大小超过5Mb`);
                return Upload.LIST_IGNORE
            }
            return new Promise((resolve, reject) => {
                const newFile = compressImage(file)
                newFile.uid = nanoid();
                file.uid = newFile.uid
                this.Props.headers.pictureId = newFile.uid;
                this.Props.headers.pictureTime = Date.now()
                resolve(newFile)
            })
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
    uploadPicture = () => {
        CheckPermissions("请先登录！")
    }

    componentWillUnmount() {
        pubSubId.map((item) => {
            return PubSub.unsubscribe(item)
        })
    }


    render() {
        const {value, showFileList} = this.state
        const {onChange, publishPost, uploadPicture, Props} = this
        return (
            <div className="edit-post-wrapper">
                <div className="edit-post">
                    <TextArea
                        className="textarea"
                        value={value}
                        maxLength={300}
                        onChange={onChange}
                        placeholder="分享点什么..."
                        autoSize={{minRows: 2, maxRows: 4}}
                    />
                    <div className="edit-btn" key={showFileList}>
                        <Button type="primary" className="publish-post-btn" onClick={publishPost}>
                            发布
                        </Button>
                    </div>
                </div>
                <div className="edit-post-icon">
                    <div className="choose-channel">
                        <NumberOutlined/>
                    </div>
                    <div className="upload-picture">
                        <Upload {...Props} className="upload-list">
                            <div onClick={uploadPicture}>
                                <PictureOutlined className="pictureOutlined"/>
                            </div>
                        </Upload>
                    </div>
                </div>
            </div>
        );

    }

}

export default withRouter(EditPost);
