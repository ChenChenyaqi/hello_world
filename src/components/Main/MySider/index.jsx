import React from 'react';
import {Layout, Menu, Affix} from "antd";
import {BarsOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom"

const {SubMenu} = Menu;
const {Sider} = Layout;

const MySider = () => {
    return (
        <Affix offsetTop={0}>
            <Sider className="site-layout-background" width={200}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{height: '100%'}}
                >
                    <SubMenu key="sub1" icon={<BarsOutlined/>} title="前端">
                        <Menu.Item key="1">
                            <Link to={"/htmlcss"}>HTML/CSS</Link>
                        </Menu.Item>
                        <Menu.Item key="2">JavaScript</Menu.Item>
                        <Menu.Item key="3">前端框架</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<BarsOutlined/>} title="后端">
                        <Menu.Item key="4">C/C++</Menu.Item>
                        <Menu.Item key="5">Java</Menu.Item>
                        <Menu.Item key="6">Python</Menu.Item>
                        <Menu.Item key="7">Other</Menu.Item>
                        <Menu.Item key="8">后端框架</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<BarsOutlined/>} title="工具">
                        <Menu.Item key="9">Git/GitHub</Menu.Item>
                        <Menu.Item key="10">Linux</Menu.Item>
                        <Menu.Item key="11">数据库</Menu.Item>
                        <Menu.Item key="12">其他</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        </Affix>
    );
}

export default MySider;