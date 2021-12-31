const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const crypto = require('crypto');
// 引入 mongoose
const mongoose = require('mongoose');
// 导入数据模型
import { User, Article } from './models/models';
// 使用mongoose连接数据
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));
// 生成一个express实例
const app = express();
// 设置视图文件存放目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 设置静态文件存放目录
app.use(express.static(path.join(__dirname, 'public')));
// 解析 urlencoded 请求体必备
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//#region <== 路由 ==>
// 响应首页get请求
app.get('/', function (req, res) {
  res.render('index', {
    title: '首页',
  });
});
app.get('/reg', function (req, res) {
  // 传递给页面需要的数据
  res.render('register', {
    title: '注册',
    user: req.session.user,
    page: 'req',
  });
});
app.post('/reg', function (req, res) {
  // ...
  let username = req.body.username,
    password = req.body.password,
    passwordRepeat = req.body.passwordRepeat;
  // 检查两次输入的密码是否一致
  if (password != passwordRepeat) {
    console.log('两次输入的密码不一致！');
    return res.redirect('/reg');
  }
  // 检查用户名是否已经存在
  // findOne() 通过传递一个参数，获取与参数对应的第一条数据
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect('/reg');
    }
    if (user) {
      console.log('用户名已经存在');
      return res.redirect('/reg');
    }
    // 对密码进行md5加密
    let md5 = crypto.createHash('md5'),
      md5password = md5.update(password).digest('hex');
    // 新建user对象用于保存数据
    let newUser = new User({
      username: username,
      password: md5password,
    });
    newUser.save(function (err, doc) {
      if (err) {
        console.log(err);
        return res.redirect('/reg');
      }
      console.log('注册成功！');
      // 将登陆用户信息存入sesson中
      // 考虑到保密性，将密码值删除，最后直接跳转到首页
      newUser.password = null;
      delete newUser.password;
      req.session.user = newUser;
      return res.redirect('/');
    });
  });
});
app.get('/login', function (req, res) {
  res.render('login', {
    title: '登录',
  });
});
app.post('/login', function (req, res) {
  // ...
});
app.get('/quit', function (req, res) {
  res.session.user = null; // 清除session
  console.log('退出成功！');
  return res.redirect('/login');
});
app.get('/post', function (req, res) {
  res.render('post', {
    title: '发布',
  });
});
app.post('/post', function (req, res) {
  // ...
});
app.get('/detail/:_id', function (req, res) {
  res.render('detail', {
    title: '笔记详情',
  });
});
//#endregion <== 路由 ==>
// 开始监听8080端口号
app.listen(8080, function (req, res) {
  console.log('app is running at port 8080');
});
