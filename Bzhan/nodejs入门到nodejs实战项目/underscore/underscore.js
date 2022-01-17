// demo1
// const { result } = require('underscore');
// var _ = require('underscore');

// var names = ['张三', '李四', '王五'];
// var ages = [18, 19, 20];
// var genders = ['男', '女', '男'];
// // 压缩
// var result_zip = _.zip(names, ages, genders);
// console.log(result_zip); // [ [ '张三', 18, '男' ], [ '李四', 19, '女' ], [ '王五', 20, '男' ] ]
// var result_unzip = _.unzip(result_zip);
// console.log(result_unzip); // [ [ '张三', '李四', '王五' ], [ 18, 19, 20 ], [ '男', '女', '男' ] ]

// demo2
var _ = require('underscore');
// 声明一段代码模板代码的 HTML 文档
var html = '<h2><%= name%></h2>';
// template()函数返回的依然是一个函数
var fn = _.template(html);
// 调用 template() 返回的这个函数fn
// fn 接收一个数据对象，并用该数据对象，将html中的模板内容替换，生成最终的 HTML 代码
var html = fn({ name: '大大' });
console.log(html);
