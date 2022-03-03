import React from 'react';
import {Space, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import './index.css'

const GetMoreButton = ({getMore, isLoading, msg}) => {

    // 按下加载按钮后
    const enterLoading = (e) => {
        e.preventDefault()
        if (!msg) {
            getMore()
        }
    };

    return (
        <div className="updateButton">
            <div>
                <Space style={{width: '100%'}}>
                    <Spin spinning={isLoading} indicator={<LoadingOutlined style={{fontSize: 15}} spin/>}/>
                    <a className="getMore" onClick={enterLoading}>{msg ? msg : "查看更多"}</a>
                </Space>
            </div>
        </div>
    );
}

export default GetMoreButton;
