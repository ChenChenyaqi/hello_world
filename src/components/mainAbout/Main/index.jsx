import React from 'react';
import {Layout} from "antd";
import EditPost from "../../postAbout/EditPost";
import AllPosts from "../../postAbout/AllPosts";

const {Content} = Layout;

const Main = () => {

    return (
        <div>
            <Layout className="site-layout-background" style={{padding: '24px 0'}}>
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
