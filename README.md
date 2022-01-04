# node-study

## projects

- 03-07 项目来自于实验楼，`https://www.lanqiao.cn/courses/455`

### 03.爬虫获取豆瓣热门电影

#### 简介

- 主要使用 Node.js,会使用到的模块有 http,fs,path,cheerio
- 其中 http 模块用于创建 http 请求，fs 模块用于保存文件，path 模块用于解析路径，cheerio 包是服务端的 jquery 实现
- 该项目中只用了一个三方包--cheerio
  > cheerio 是一个用来抓取网络数据的 API,为服务器特别定制的，快速，灵活，实施的 jQuery 核心实现。

#### 项目运行

1. 进入 `douban` 文件加下，`npm install` 安装依赖包
2. `npm start` 启动服务
3. 进入到 `spider` 文件夹下，`node spider.js` 启动服务

#### HTTP 模块

- 此项目中主要用到的 http 模块共有两个属性，四个 class，四个方法以及两个对象

```javascript
http.METHODS; // 返回解析器支持的所有HTTP方法
http.STATUS_CODES; // 返回所有状态码及其说明
Class: http.Server;
Class: http.ServerResponse;
Class: http.Agent;
Class: http.ClientRequest;
http.createServer([requestListener]); // 用于创建http服务
http.createClient([port], host); // 用于发送http请求(已弃用)
http.request(options[,callback]) // 用于发送http请求
http.get(options[,callback]) // 用于发送http get请求
http.globalAgent
http.IncomingMessage
```

- http.createServer([requestListener])方法用于创建 http 服务，返回值是 Class: http.Server 的一个实例

```javascript
// 这里 server 就是 Class: http.Server 的一个实例
// 是由 http.createServer 返回的
var server = http.createServer(function (req, res) {
  // 回调函数中的参数req, res
  // req 是 http.IncomingMessage 对象的一个实例
  // res 是 Class: http.ServerReponse 的一个实例
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
// 另一种等效的方法
// 通过 Class 创建web服务
var server2 = new http.Server();
server2.on('request', function (req, res) {
  res.writeHeader(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
```

> http.createClient([port], [ host])方法已经被弃用了，新方法是 http.request 和 http.get，用于发送 http 请求，http.get 是 http.request 的简化版，只能发送 GET 请求。返回的都是 Class: http.ClientRequest 的一个实例。

#### JSON.stringify()

- `JSON.stringify(data, replacer, space)`
  - 第一个参数是要序列化的数据
  - 第二个 replacer 参数有两种形式，可以是一个函数或者一个数组。作为函数时，它有两个参数，键（key）和值（value），函数类似就是数组方法 map、filter 等方法的回调函数，对每一个属性值都会执行一次该函数。如果 replacer 是一个数组，数组的值代表将被序列化成 JSON 字符串的属性名。
    replacer 一般为 null
  - 第三个参数是要缩进的字符，可以设置为 4，表示缩进 4 个字符

### 04.在线笔记

#### 项目简介

- 主要使用 `Node.js (path,body-parser,crypto), MongoDB, Express, Boostrap, bower`
  - Express 做服务托管
  - bower 管理前端资源依赖，能依据配置文件自动下载相关依赖，在`public`目录下执行命令 `bower install bootstrapp#3.3.5`，完成后目录下会多出一个 `bower_components` 文件夹，其中就包含我们需要的 bootstrap 以及其依赖的 jquery
- louNote 是参考源码，myNote 是实践的项目

#### 项目运行

1. 进入`louNode`文件夹，然后运行`npm install`，如果执行不成功，则`cnpm install`
2. 运行`node app.js`启动服务

> 通过使用 Node.js 及与其配合良好的 web 应用框架 Express 搭建服务端，配合 mongoDB 存储数据，
> 使用 ejs 模板渲染前端页面的方式完成一个简单的私人笔记应用
> 热更新启动方式 ==>
> 安装 supervisor 模块，能在保存修改的文件后自动重启应用服务，省去了手动重启服务的过程，非常方便。
> 需要提醒的是，安装 supervisor 模块后，项目的启动指令对应改为 supervisor app.js。

#### 路由及视图文件

##### 功能设计

- 项目需要的功能有：
  - 注释
  - 登录
  - 发布笔记
  - 笔记列表
  - 笔记详情
  - 退出登录
- 会话机制
  - 建立 session 模型
    > 在 Express 框架中需要安装两个模块 express-session 和 connect-mongo
