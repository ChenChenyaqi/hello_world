import React from 'react';
import {Button, Space} from 'antd';
import './index.css'

const GetMoreButton = ({getMore, isLoading}) => {

    // 按下加载按钮后
    const enterLoading = () => {
        getMore()
    };

    return (
        <div className="updateButton">
            <div>
                <Space style={{width: '100%'}}>
                    <Button style={{margin: '0 auto'}} type="primary" loading={isLoading}
                            onClick={enterLoading}>
                        查看更多
                    </Button>
                </Space>
            </div>
        </div>
    );
}

export default GetMoreButton;
