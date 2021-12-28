function route(handle, pathname, response) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] == 'function') {
    handle[pathname](response);
  } else {
    console.log('no request handler found for ' + pathname);
    return '404 not found'; // 当请求无法路由的时候，也向【前端/浏览器】返回一些相关的错误信息
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('hello world');
    response.end();
  }
}
exports.route = route;
