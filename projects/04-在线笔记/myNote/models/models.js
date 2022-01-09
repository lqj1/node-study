/**
 * 设计mongoDB数据模型
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// 定义用户的数据模型
let userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createTime: {
    type: Date,
    default: Date.now,
  },
});
// 导出用户数据模型
exports.User = mongoose.model('User', userSchema);

// 定义笔记的数据模型
let noteSchema = new Schema({
  title: String,
  author: String,
  tag: String,
  content: String,
  createTime: {
    type: Date,
    default: Date.now,
  },
});
// 导出笔记数据模型
exports.Article = mongoose.model('Note', noteSchema);

const http = require('http');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
http
  .createServer(function (req, res) {
    // 1. 获取用户请求的路径
    // req.url
    // /css/index.css(css样式)
    // /image/index.png(图片)
    // 2. 获取 public 目录的完整路径
    let publicDir = path.join(__dirname, 'public');
    // 3. 根据public的路径和用户请求的路径，最终计算出用户请求的静态资源的完整路径
    let filename = path.join(publicDir, req.url);
    // 4. 根据文件完整路径去读取文件
    fs.readFile(filename, function (err, data) {
      if (err) {
        res.end('文件不存在！');
      }
      // 通过第三方模块 mime, 来判断不同的请求资源对应的 content-type 的类型
      // mime.getType('txt') => 'text/plain'
      // mime.getExtension('text/plain') => 'txt'
      res.setHeader('Content-Type', mime.getType(filename));
      res.end(data);
    });
  })
  .listen(8080, function () {
    console.log('listening on http://localhost:8080');
  });
