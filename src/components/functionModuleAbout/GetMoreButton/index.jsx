import React, {Component} from 'react';
import {Space, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import './index.css'


// 是否去获取更多
let isSendGetMore = true

class GetMoreButton extends Component{

    toGetMore = () => {
        const {obj, getMore, msg} = this.props
        const scrollElement = obj.current;
        // 如果没有数据了，就取消滚动事件
        if(msg){
            window.removeEventListener('scroll', this.toGetMore)
            return
        }
        // 判断是否滚动到底部，如果到底部，则发送请求，获取更多
        if (isSendGetMore &&  document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop) - scrollElement.offsetTop
            >= scrollElement.scrollHeight) {
            isSendGetMore = false
            getMore()
            setTimeout(() => {
                isSendGetMore = true
            }, 200)
            // 解绑滚动事件
        }
    }

    componentDidMount() {
        const {obj} = this.props
        const scrollElement = obj.current;
        // 绑定滚动事件
        window.addEventListener('scroll', this.toGetMore)
    }

    componentWillUnmount() {
        const {obj} = this.props
        const scrollElement = obj.current;
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
