import React from 'react';
import {Avatar} from "antd";

const MyAvatar = ({username, setSize, bgcolor, url}) => {
    return (
        <div>
            <Avatar
                size={setSize ? {xs: 30, sm: 35, md: 40, lg: 45, xl: 50, xxl: 55} : ''}
                style={!url ? {backgroundColor: bgcolor || '#f56a00', verticalAlign: 'middle'} : ''}
                src={url || ''}
            >{username.slice(0,1)}</Avatar>
        </div>
    );
}

export default MyAvatar;
