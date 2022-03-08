import React from 'react';
import {Layout} from "antd";
import EditPost from "../../postAbout/EditPost";
import AllPosts from "../../postAbout/AllPosts";
import './index.css'

const {Content} = Layout;

const Main = () => {

    return (
        <div>
            <Layout className="site-layout-background main-wrapper">
                <Content style={{ minHeight: 280}}>
                    {/*发帖框*/}
                    <EditPost/>
                    {/*浏览贴子区*/}
                    <AllPosts/>
                </Content>
            </Layout>
        </div>
    );
}

export default Main;
