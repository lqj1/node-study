var http = require('http');
var url = require('url');
function start(route, handle) {
  function onRequest(request, response) {
    // 通过引入url模块来解析路径，并传入路由
    var pathname = url.parse(request.url).pathname;
    console.log('request for ' + pathname + ' received.');

    route(handle, pathname, response); // 路由处理，相比阻塞版本，引入response，并将response相关的交给route处理
  }
  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}
exports.start = start;
