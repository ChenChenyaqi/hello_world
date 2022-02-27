import React, {Component} from 'react';
import {Button, Space, message} from 'antd';
import PubSub from 'pubsub-js'
import axios from "axios";
import localhost from "../../../utils/localhost";
import './index.css'

class UpdateButton extends Component {
    state = {
        loadings: [],
    };

    start = 0;
    step = 10;

    // 按下加载按钮后
    enterLoading = index => {
        this.setState(({loadings}) => {
            const newLoadings = [...loadings];
            newLoadings[index] = true;
            return {
                loadings: newLoadings,
            };
        });
        axios.get(`http://${localhost}:8080/post?start=${this.start + this.step}&step=10`).then(
            response => {
                this.start += this.step;
                PubSub.publish('pushNewPosts', response.data.posts)
                if (response.data.posts.length === 0) {
                    message.info('没有更多了...');
                }
                setTimeout(() => {
                    this.setState(({loadings}) => {
                        const newLoadings = [...loadings];
                        newLoadings[index] = false;

                        return {
                            loadings: newLoadings,
                        };
                    });
                }, 1000);
            })
    };

    render() {
        const {loadings} = this.state;
        return (
            <div className="updateButton">
                <div>
                    <Space style={{width: '100%'}}>
                        <Button style={{margin: '0 auto'}} type="primary" loading={loadings[0]}
                                onClick={() => this.enterLoading(0)}>
                            查看更多
                        </Button>
                    </Space>
                </div>
            </div>
        );
    }
}

export default UpdateButton;
