# 接口文档

## 1、用户登录

### 请求URL:

```
http://129.211.169.43:8080/user/login
```

### 请求方式：

```
POST
```

### 参数类型：请求体

```
|参数		|是否必选	|类型		|说明
|username	|yes	|String		|用户名
|password	|yes	|String		|密码
```

### 返回示例：

```json
// 登录成功
{
	"msg":"登录成功",
				"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwic3Vi4joiYWRtaW4tdGVzdCIsImV4cCI6MTY0NjU0OTM3OSwianRpIjoiOTQxMWE5ODctNGE4YS00MWRlLThjMTYtMzFjZTZmYjM0MWI5In0.vOkTAW5SETAong-kXttrAvgNtRKiQb7jnHvmwYXsuYo"
}
// 登录失败
{
	"msg":"用户名或密码错误"
}
```

