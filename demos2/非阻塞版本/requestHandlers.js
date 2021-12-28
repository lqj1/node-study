// 将请求处理程序和路由模块连接起来，让路由"有路可寻"
var exec = require('chil').exec;
function start(response) {
  console.log('request handler start was called');
  exec('ls -lah', function (error, stdout, stderr) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(stdout);
    response.end();
  });
}
function upload(response) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('Hello Upload');
  response.end();
}
exports.start = start;
exports.upload = upload;

/**
 现在我们采用如下这种新的实现方式来实现非阻塞：
 相对采用将内容传递给服务器的方式，我们这次采用将服务器“传递”给内容的方式。 从实践角度来说，就是将response对象（从服务器的回调函数onRequest()获取）通过请求路由传递给请求处理程序。 随后，处理程序就可以采用该对象上的函数来对请求作出响应。
 */
