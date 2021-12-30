# node-study

## projects

### 03.爬虫获取豆瓣热门电影

#### 简介

- 主要使用 Node.js,会使用到的模块有 http,fs,path,cheerio
- 其中 http 模块用于创建 http 请求，fs 模块用于保存文件，path 模块用于解析路径，cheerio 包是服务端的 jquery 实现
- 该项目中只用了一个三方包--cheerio
  > cheerio 是一个用来抓取网络数据的 API,为服务器特别定制的，快速，灵活，实施的 jQuery 核心实现。

#### HTTP 模块

- 此项目中主要用到的 http 模块共有两个属性，四个 class，四个方法以及两个对象

```javascript
http.METHODS; // 返回解析器支持的所有HTTP方法
http.STATUS_CODES; // 返回所有状态码及其说明
Class: http.Server;
Class: http.ServerResponse;
Class: http.Agent;
Class: http.ClientRequest;
```
