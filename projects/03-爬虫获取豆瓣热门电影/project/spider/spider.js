'use strict';
// 引入模块
let http = require('http');
let fs = require('fs');
let path = require('path');
let cheerio = require('cheerio');

/**
 * @description: 保存数据到本地
 * @param {string}: path 保存数据的文件夹
 * @param {array}: movies 电影信息数组
 */
function saveData(path, movies) {
  // 调用 fs.writeFile 方法保存数据到本地
  // fs.writeFile(filename, data[, options], callback)
  // fs.writeFile 方法第一个参数是需要保存在本地的文件名称（包含路径）
  // 第二个参数是文件数据
  // 然后有个可选参数，可以是 encoding，mode 或者 flag
  // 最后一个 参数是一个回调函数
  fs.writeFile(path, JSON.stringify(movies, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Data saved');
  });
}
// 如果想要下载电影的图片的话，需要新建一个 http 请求，因为每张图片都是一个新的链接，抓取到图片后我们可以通过 fs 模块保存图片到本地
/**
 * @description: 下载电影图片
 * @param {string}: imgDir 存放图片的文件夹
 * @param {string}: url 图片的URL地址
 */
function downloadImg(imgDir, url) {
  http
    .get(url, function (res) {
      let data = '';
      res.setEncoding('binary');
      res.on('data', function (chunk) {
        data += chunk;
      });
      res.on('end', function () {
        // 调用 fs.writeFile 方法保存图片到本地
        // path.basename(url) 可以得到链接指向的文件名
        // 如：path.basename('http://localhost/img/2.jpg') => '2.jpg'
        fs.writeFile(imgDir + path.basename(url), data, 'binary', function (err) {
          if (err) {
            return console.log(err);
          }
          console.log('Image downloaded: ', path.basename(url));
        });
      });
    })
    .on('error', function (err) {
      console.log(err);
    });
}

// 爬虫的URL信息
let opt = {
  hostname: 'localhost',
  path: '/douban.html',
  port: 8080,
};
// 创建http get请求
http
  .get(opt, function (res) {
    let html = ''; // 保存抓取到的HTML源码
    let movies = []; // 保存解析HTML后的数据，即我们需要的电影信息
    // 前面说过
    // 这里的 res 是 Class: http.IncomingMessage 的一个实例
    // 而 http.IncomingMessage 实现了 stream.Readable 接口
    // 所以 http.IncomingMessage 也有 stream.Readable 的事件和方法
    // 比如 Event: 'data', Event: 'end', readable.setEncoding() 等
    // console.log('test', res);
    res.setEncoding('utf-8');
    // 抓取页面内容
    res.on('data', function (chunk) {
      html += chunk;
    });
    res.on('end', function () {
      // 使用cheerio加载抓取到的HTML代码
      // 然后就可以使用jquery的方法了
      // 比如获取某个class:$('.className')
      let $ = cheerio.load(html);
      // 每部电影在 class 为 item 的元素中
      $('.item').each(function () {
        // 获取图片链接
        let picUrl = $('.pic img', this).attr('src');
        let movie = {
          title: $('.title', this).text(), // 获取电影名称
          star: $('.info .star em', this).text(), // 获取电影评分
          link: $('a', this).attr('href'), // 获取电影详情页链接
          picUrl: /^http/.test(picUrl) ? picUrl : 'http://localhost:8080/' + picUrl, // 组装电影图片链接
        };
        // 把所有电影放在一个数组里面
        movies.push(movie);
        // 下载电影图片
        downloadImg('img/', movie.picUrl);
      });
      // console.log(movies);
      // 保存抓取到的电影资源
      saveData('data/data.json', movies);
    });
  })
  .on('error', function (err) {
    console.log('err', err);
  });
