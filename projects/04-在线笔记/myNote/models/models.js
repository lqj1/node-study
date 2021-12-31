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
