// 01.当前项目（包）的入口文件
// 02.封装一个 render() 函数
// 1. 加载模块
// http服务请求模块
var http = require('http');
// 文件操作模块
var fs = require('fs');
// 路径处理模块
var path = require('path');
// 处理不同类型的静态资源文件
var mime = require('mime');
// 2. 创建服务
http
  .createServer(function (req, res) {
    // body...
    // 要在这里写大量代码
    // 设计路由
    // 当用户请求 / 或 /index 时，显示新闻消息 - get请求
    // 当用户请求 /item 时，显示新闻详情 - get请求
    // 当用户请求 /submit 时，显示添加新闻页面 - get请求
    // 当用户请求 /add 时，将用户提交的新闻保存到 data.json 文件中 - get请求
    // 当用户请求 /add 时，将用户提交的新闻保存到 data.json 文件中 - get请求
    req.url = req.url.toLowerCase(); // 将大写字符转成小写
    req.method = req.method.toLowerCase();
    // 先根据用户请求的路径（路由），将对应的html页面显示出来
    if (req.url === '/' || (req.url === '/index' && req.method === 'get')) {
      // 1. 读取 index.html 并返回
      render(path.join(__dirname, 'views', 'index.html'), res);
    } else if (req.url === '/submit' && req.method === 'get') {
      // 1. 读取 submit.html 并返回
      render(path.join(__dirname, 'views', 'submit.html'), res);
    } else if (req.url === '/item' && req.method === 'get') {
      // 读取 detail.html 并返回
      render(path.join(__dirname, 'views', 'details.html'), res);
    } else if (req.url === '/add' && req.method === 'get') {
      // 表示 get 方法提交一条新闻
    } else if (req.url === '/add' && req.method === 'post') {
      // 表示 post 方法提交一条新闻
    } else if (req.url.startsWith('/resources') && req.method === 'get') {
      // 如果用户请求是以 /resources 开头，并且使 get 请求，就认为用户是要请求静态资源，在本地文件夹中读取文件资源
      render(path.join(__dirname, req.url), res);
    } else {
      res.writeHead(404, 'Not Found', {
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.end('404, Page Not Found.');
    }
  })
  .listen(9090, function () {
    console.log('http://localhost:9090');
  });

// 封装一个render函数
function render(filename, res) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('404,not found');
      return;
    }
    res.setHeader('Content-Type', mime.getType(filename));
    res.end(data);
  });
}
