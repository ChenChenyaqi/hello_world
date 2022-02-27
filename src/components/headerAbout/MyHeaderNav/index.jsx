import React from 'react';
import {Link} from 'react-router-dom'
import './index.css'

const MyHeaderNav = () => {

    return (
        <div className="header-nav">
            <div>
                <Link to={'/'}>首页</Link>
            </div>
            <div>
                <Link to={'/activity'}>活动</Link>
            </div>
            <div>
                <a href="/">加入我们</a>
            </div>
            <div>
                <a href="/">官方QQ群
                    <div className="qrcode">
                        <img style={{height: "100px"}} src="/img/Hello World群聊二维码.png" alt="Hello World群聊二维码"/>
                    </div>
                </a>
            </div>

        </div>
    );
}

export default MyHeaderNav;