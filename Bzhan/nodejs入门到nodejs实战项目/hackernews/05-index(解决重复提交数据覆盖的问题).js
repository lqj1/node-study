// 01.当前项目（包）的入口文件
// 02.封装一个 render() 函数
// 03.将render函数挂载到 res 对象上，可以通过 res.render() 来访问
// 04.实现get方式添加新闻
// 05.实现在原来list数组的基础上追加新闻，而不是覆盖
// 1. 加载模块
// http服务请求模块
var http = require('http');
// 文件操作模块
var fs = require('fs');
// 路径处理模块
var path = require('path');
// 处理不同类型的静态资源文件
var mime = require('mime');
// url模块解析请求路径
var url = require('url');
// 2. 创建服务
http
  .createServer(function (req, res) {
    // body...
    // 要在这里写大量代码
    // 为 res 对象添加一个render()函数，方便以后使用，因为在res上添加，所以也不需要传入res
    res.render = function (filename) {
      fs.readFile(filename, function (err, data) {
        if (err) {
          res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('404,not found');
          return;
        }
        res.setHeader('Content-Type', mime.getType(filename));
        res.end(data);
      });
    };
    // 设计路由
    // 当用户请求 / 或 /index 时，显示新闻消息 - get请求
    // 当用户请求 /item 时，显示新闻详情 - get请求
    // 当用户请求 /submit 时，显示添加新闻页面 - get请求
    // 当用户请求 /add 时，将用户提交的新闻保存到 data.json 文件中 - get请求
    // 当用户请求 /add 时，将用户提交的新闻保存到 data.json 文件中 - get请求
    req.url = req.url.toLowerCase(); // 将大写字符转成小写
    req.method = req.method.toLowerCase();
    // 通过url模块，调用url.parse()方法解析用户请求的url(req.url)
    var urlObj = url.parse(req.url, true);
    // console.log(urlObj);
    // 先根据用户请求的路径（路由），将对应的html页面显示出来
    if (req.url === '/' || (req.url === '/index' && req.method === 'get')) {
      // 1. 读取 index.html 并返回
      res.render(path.join(__dirname, 'views', 'index.html'));
    } else if (req.url === '/submit' && req.method === 'get') {
      // 1. 读取 submit.html 并返回
      res.render(path.join(__dirname, 'views', 'submit.html'));
    } else if (req.url === '/item' && req.method === 'get') {
      // 读取 detail.html 并返回
      res.render(path.join(__dirname, 'views', 'details.html'));
    } else if (req.url.startsWith('/add') && req.method === 'get') {
      // 表示 get 方法提交一条新闻
      // 要获取用户 get 提交的数据，需要用到 url 模块（这个模块是nodejs内置模块）
      // 1. 获取用户 get 提交过来的新闻数据
      // urlObj.query.title;
      // urlObj.query.url;
      // urlObj.query.text;
      // 1.1 读取 data.json 文件中的数据，然后将数据转换为一个数组
      // 通过 utf-8 编码使回调函数中的data为字符串
      fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf-8', function (err, data) {
        // body...
        // 第一次访问网站，data.json文件本身就不存在，肯定是有错误的，这种错误并非网站出错，所以不需要抛出异常
        if (err && err.code !== 'ENOENT') {
          throw err;
        }
        // console.log('data', data);
        // 原来的data数据只是一串字符串
        // 如果读取到数据，就转成list数组，否则转{}
        // 第一次读取不到data.json，返回undefined，所以保证list始终是一个数组
        var list = JSON.parse(data || '[]');
        list.push(urlObj.query);
        // 2. 把用户提交的新闻数据保存到 data.json 文件中
        // 把list数组中的数据写入到data.json文件中
        fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err) {
          if (err) {
            throw err;
          }
          console.log('ok ');
          // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
          // 3. 跳转到新闻列表页
          // 重定向，服务器告诉浏览器跳转
          res.statusCode = 302;
          res.statusMessage = 'found';
          res.setHeader('Location', '/');
          res.end();
        });
      });
    } else if (req.url === '/add' && req.method === 'post') {
      // 表示 post 方法提交一条新闻
    } else if (req.url.startsWith('/resources') && req.method === 'get') {
      // 如果用户请求是以 /resources 开头，并且使 get 请求，就认为用户是要请求静态资源，在本地文件夹中读取文件资源
      res.render(path.join(__dirname, req.url));
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

// // 封装一个render函数
// function render(filename, res) {
//   fs.readFile(path.join(__dirname, req.url), function (err, data) {
//     if (err) {
//       res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html; charset=utf-8' });
//       res.end('404,not found');
//       return;
//     }
//     res.setHeader('Content-Type', mime.getType(filename));
//     res.end(data);
//   });
// }
