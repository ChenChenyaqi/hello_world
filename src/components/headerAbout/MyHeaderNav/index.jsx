import React from 'react';
import {Link} from 'react-router-dom'
import './index.css'
import {message} from "antd";

const MyHeaderNav = () => {

    const copyQQNumber = (e) => {
        e.preventDefault();
        const span = document.getElementById("qq-number");
        const input = document.createElement("input");
        input.type = "text";
        document.body.appendChild(input);
        input.value = span.innerText;
        input.select();
        if (document.execCommand("Copy")) {
            document.execCommand("Copy");
            message.info('已复制QQ群号')
        }
        document.body.removeChild(input);
    }

    return (
        <div className="header-nav">
            <div>
                <Link to={'/'}>首页</Link>
            </div>
            <div>
                <a href="/" onClick={copyQQNumber}>官方QQ群
                    <div className="qrcode">
                        <img style={{height: "100px"}} src="/img/Hello World群聊二维码.png" alt="Hello World群聊二维码"/>
                        <span id="qq-number">662605011</span>
                    </div>
                </a>
            </div>

        </div>
    );
}

export default MyHeaderNav;
