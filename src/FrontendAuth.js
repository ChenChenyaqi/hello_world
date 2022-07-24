/**
 * 路由守卫校验
 */
import React, {useState} from "react";
import {Route, Redirect} from "react-router-dom";
import CheckPermissions from "./utils/CheckPermissions";

const FrontendAuth = (props) => {

    const [component, setComponent] = useState(null)
    const [url, setUrl] = useState(null)

    const matchPath = (path, target) => {
        const targetArr = target.split('/');
        if(targetArr[1] === 'detailPost' || targetArr[1] === "user"){
            const arr = path.split('/');
            return arr[1] === targetArr[1];
        } else {
            return path === target;
        }

    }

    const check = () => {
        // routerConfig就是配置的routerMap
        const {routerConfig, location} = props;
        // 当前访问的路径
        const {pathname} = location;

        // 如果该路由不用进行权限校验
        // 获取访问路径
        const targetRouterConfig = routerConfig.find(
            (item) => matchPath(item.path, pathname)
        );

        // 检验权限
        const p = new Promise((resolve, reject) => {
            CheckPermissions(resolve, reject)
        })
        p.then(value => {
            // 如果是登陆状态，想要跳转到登陆，重定向到主页
            if (pathname === "/login" || pathname === '/regist' || pathname === 'forget') {
                return <Redirect to="/"/>;
            } else {
                // 如果路由合法，就跳转到相应的路由
                if (targetRouterConfig) {
                    return (
                        <Route path={pathname} component={targetRouterConfig.component}/>
                    );
                } else {
                    // 如果路由不合法，重定向到 404 页面
                    return <Redirect to="/"/>;
                }
            }
        }, reason => {
            // 如果找到了正确路径，并且不需要检查权限，则允许访问
            if (targetRouterConfig && !targetRouterConfig.auth) {
                const {component} = targetRouterConfig;
                return <Route exact path={pathname} component={component}/>;
            }
            // 非登陆状态下，当路由合法时且需要权限校验时，跳转到登陆页面，要求登陆
            if (targetRouterConfig && targetRouterConfig.auth) {
                return <Redirect to="/login"/>;
            } else {
                // 非登陆状态下，路由不合法时，重定向至 404
                return <Redirect to="/"/>;
            }
        }).then(value => {
            setComponent(value)
        },reason => {
            setComponent(reason)
        })
    }

    if(props.location.pathname !== url){
        check()
        setUrl(props.location.pathname)
    }

    return(
        component
    )

}

export default FrontendAuth;
