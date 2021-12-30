/*
 * @Description:
 * @version:
 * @Author: lqj
 * @Date: 2021-12-26 17:06:43
 * @LastEditors: lqj
 * @LastEditTime: 2021-12-30 22:51:49
 */

const http = require('http');
const https = require('https');
const cheerio = require('cheerio'); // 后端转成虚拟dom

// 筛选数据函数
function filterData(data) {
  // console.log('data: ', data);
  const $ = cheerio.load(data);
  // 再解析相应的dom元素并进行分析
}

const server = http.createServer((req, res) => {
  let data = '';
  https.get('https://www.mi.com/', result => {
    result.on('data', chunk => {
      data += chunk;
      console.log('result-on');
    });
    result.on('end', () => {
      console.log('result-end');
      filterData(data);
    });
  });
});
server.listen(8080, () => {
  console.log('listen on 8080');
});
