# HelloWorld - 编程爱好者社区

## 一、项目介绍

一个提供给热爱编程的小伙伴们，可发帖、评论、点赞、交流技术、答疑解惑的在线平台。

## 二、项目结构

```c
src
	|--components	//## 所有组件
    |	|--commentAbout	//# 评论相关组件
    |	|	|--AllComments	// 存放所有评论的容器组件
    |	|	|--EditComment	// 编辑评论组件
    |	|	|--MyComment	// 评论组件
    |	|--footerAbout	//# 页面底部相关组件
    |	|	|--MyFooter		// 页脚组件
    |	|--functionModuleAbout	// 功能组件
    |	|	|--LoginAndRegist		// 存放登录注册的容器组件
    |	|	|--UpdateButton			// 点击获取更新数据组件
    |	|--headerAbout	//# 页面顶部相关组件
    |	|	|--MyHeader		// 页头组件
    |	|	|--MyHeaderNav	// 页头导航组件
    |	|--mainAbout	//# 页面中心区域相关组件
    |	|	|--Main			// 页面中心区域组件
    |	|	|--MySider		// 侧边栏组件
    |	|--postAbout	//# 帖子相关组件
    |	|	|--AllPosts		// 存放所有帖子的容器组件
    |	|	|--EditPost		// 发布帖子组件
    |	|	|--Post			// 帖子组件
  	|--pages	//## 所有路由组件
    |	|--Activity	// 活动组件
    |	|--Forget	// 忘记密码组件
    |	|--Login	// 登录组件
    |	|--Regist	// 注册组件
    |	|--User		// 个人中心组件
  	|--utils	// 项目所需工具方法
  	|App.js
  	|index.js
```

## 三、技术选项

### 前端

- React
- Redux
- Ant Design
- axios
- moment
- nanoid
- pubsub-js
- Less

### 后端

- Spring Boot
- Lombok
- MySQL
- MyBatis-plus
- 阿里云OSS
- JWT
- Javax mail