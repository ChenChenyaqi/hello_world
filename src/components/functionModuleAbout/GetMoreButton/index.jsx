import React, {Component} from 'react';
import {Space, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import './index.css'


// 是否去获取更多
let isSendGetMore = true

class GetMoreButton extends Component{

    toGetMore = () => {
        // 如果没有数据了，就取消滚动事件
        if(this.props.msg){
           window.removeEventListener('scroll', this.toGetMore)
            return
        }
        // 获取getMore按钮
        const getMoreBtn = document.querySelector('.getMore')
        // 判断是否滚动到底部，如果到底部，则发送请求，获取更多
        if (isSendGetMore && window.pageYOffset + document.documentElement.clientHeight > getMoreBtn.offsetTop + getMoreBtn.offsetHeight) {
            isSendGetMore = false
            this.props.getMore()
            setTimeout(() => {
                isSendGetMore = true
            }, 200)
        }
    }

    componentDidMount() {
        // 绑定滚动事件
        window.addEventListener('scroll', this.toGetMore)
    }

    componentWillUnmount() {
        // 解绑滚动事件
        window.removeEventListener('scroll', this.toGetMore)
    }

    render() {
        const {isLoading, msg} = this.props
        return (
            <div className="getMore-wrapper">
                <div>
                    <Space>
                        <Spin spinning={isLoading} indicator={<LoadingOutlined spin/>}/>
                        <span className='getMore'>{msg || '查看更多'}</span>
                    </Space>
                </div>
            </div>
        );
    }
}
export default GetMoreButton;
