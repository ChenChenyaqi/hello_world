import React from 'react';
import {Spin} from 'antd';

const Loading = ({isLoading}) => {
    return (
        <>
            {
                isLoading ?  <Spin/> : null
            }
        </>
    );
}

export default Loading;
