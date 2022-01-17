// 01.当前项目（包）的入口文件
// 02.封装一个 render() 函数
// 03.将render函数挂载到 res 对象上，可以通过 res.render() 来访问
// 04.实现get方式添加新闻
// 05.实现在原来list数组的基础上追加新闻，而不是覆盖
// 06.实现post方式提交新闻
// 07.实现首页显示新闻列表
// 08.修复post写入文件无法覆盖问题
// 09.显示新闻每一条的详情
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
// 转换post的查询字符串
var querystring = require('querystring');
// 加载underscore.js
var _ = require('underscore');
// 2. 创建服务
http
  .createServer(function (req, res) {
    // body...
    // 要在这里写大量代码
    // 为 res 对象添加一个render()函数，方便以后使用，因为在res上添加，所以也不需要传入res
    // 现在要渲染的 index.html 中需要用到模板数据，所以给 render 函数增加了第二个参数
    // 第二个参数作用：用来传递一些html页面中需要使用的模板数据
    res.render = function (filename, tplData) {
      fs.readFile(filename, function (err, data) {
        if (err) {
          res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('404,not found');
          return;
        }
        // 用户传递了模板数据，进行underscore的template方法进行替换
        // 如果用户没有传递模板，那么就不进行替换
        if (tplData) {
          // 如果用户传递了模板数据，表示要进行模板替换
          // 这里的模板文件是整个 html 文件， 传入html的参数是tplData，如下 list
          // list: [
          //   { title: 'test2', url: 'test2.com', text: 'text2' },
          //   { title: 'aaa', url: 'aaaaa.com', text: 'aaaaaa' },
          //   { title: 'bbbbbb', url: 'bbbbbb.com', text: 'bbbbbb' },
          //   { title: 'cccccccc', url: 'cccccccc.com', text: 'cccccccc' }
          // ]
          var fn = _.template(data.toString('utf8'));
          console.log('tplData', tplData);
          data = fn(tplData);
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
      // 1. 读取 data.json 文件中的数据，并将读取到的数据转换为 list 数组
      // 注意这里读取的是 data.json 中的文件，submit.html中的提交方式区分 get/post
      fs.readFile(path.join(__dirname, 'data', 'data_post.json'), 'utf-8', function (err, data) {
        if (err && err.code !== 'ENOENT') {
          throw err;
        }
        // 读取到的新闻数据
        var list_news = JSON.parse(data || '[]');
        // 2. 在服务端使用模板引擎，将list中的数据和index.html文件中的内容结合渲染给客户端
        // 读取 index.html
        // console.log('list_news', list_news);
        res.render(path.join(__dirname, 'views', 'index.html'), { list: list_news });
      });
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
        // 在把新闻添加到list之前，为新闻增加一个id属性
        urlObj.query.id = list.length;
        list.push(urlObj.query);
        // 2. 把用户提交的新闻数据保存到 data.json 文件中
        // 把list数组中的数据写入到data.json文件中
        fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err) {
          if (err) {
            throw err;
          }
          // console.log('ok ');
          // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
          // 3. 跳转到新闻列表页
          // 重定向，服务器告诉浏览器跳转
          res.statusCode = 302;
          res.statusMessage = 'found';
          res.setHeader('Location', '/');
          res.end();
        });
      });
    } else if (req.url.startsWith('/add') && req.method === 'post') {
      // 表示 post 方法提交一条新闻
      // 1. 读取 data.json 文件中的数据
      fs.readFile(path.join(__dirname, 'data', 'data_post.json'), 'utf-8', function (err, data) {
        if (err && err.code !== 'ENOENT') {
          throw err;
        }
        // 2. 获取用户post提交的数据
        // 因为post提交数据的时候，数据量比较大，所以会分多次进行提交
        // 此时要想在服务器中获取用户提交的所有数据，必须监听request事件的data事件（因为每次浏览器提交一部分数据到服务器就会触发一次data事件）
        // 当request.end事件触发表示已经提交了所有的数据
        // 监听request对象的data事件和end事件代码如下：
        // 声明一个数组保存用户每次提交的数据
        var array = [];
        // 获取原来data_post文件中的内容
        var list_post = JSON.parse(data || '[]');
        req.on('data', function (chunk) {
          // 此处 chunk 参数就是浏览器本次提交过来的一部分数据
          // chunk 的数据类型就是 Buffer(chunk就是一个Buffer对象)
          array.push(chunk);
        });
        // 当 end 事件被触发的时候，表示所有的数据都已经提交完毕了
        req.on('end', function () {
          // 在这个事件中只要把array中所有的数据汇总起来就好了
          // 把array中每个Buffer对象，集合起来转换成一个Buffer对象
          // title=ffff&url=ffff&text=fffff,这里需要加载 querystring 模块
          // 注意区别于之前get请求的 {title:'ffff',url:'ffffff', text:'ffffffff'}，这里可以直接用 JSON.parse
          var postBody = Buffer.concat(array);
          // console.log('postBody', postBody);
          // 将获取的buffer转成字符串,直接使用Buffer的toString
          postBody = postBody.toString('utf-8');
          postBody = querystring.parse(postBody);
          // console.log('postbody', postBody);
          // 在把新闻添加到list之前，为新闻增加一个id属性
          postBody.id = list_post.length;
          // 将用户提交的新闻push到list_post中
          list_post.push(postBody);
          // 4. 将list数组转成字符串写入data.json文件中
          console.log('list_post', list_post);
          fs.writeFile(path.join(__dirname, 'data', 'data_post.json'), JSON.stringify(list_post), function (err) {
            if (err) {
              throw err;
            }
            // 5. 重定向
            res.statusCode = 302;
            res.statusMessage = 'Found';
            res.setHeader('Location', '/');
            res.end();
          });
        });
      });
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
