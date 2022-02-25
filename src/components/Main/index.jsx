import React from 'react';
import {Layout} from "antd";
import MySider from "./MySider";
import EditPost from "./EditPost";
import AllPosts from "./AllPosts";

const {Content} = Layout;

const Main = () => {

    return (
        <div>
            <Layout className="site-layout-background" style={{padding: '24px 0'}}>
                {/*左侧导航条*/}
                <MySider/>
                <Content style={{padding: '0 24px', minHeight: 280}}>
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
