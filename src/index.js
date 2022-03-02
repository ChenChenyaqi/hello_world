// 引入react核心库
import React from 'react'
// 引入ReactDOM
import ReactDOM from 'react-dom'
// 引入HashRouter
import {HashRouter} from "react-router-dom";
// 引入App组件
import App from './App'
import store from "./redux/store";
import {Provider} from "react-redux";

// 渲染App到页面
ReactDOM.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>, document.getElementById('root')
)
