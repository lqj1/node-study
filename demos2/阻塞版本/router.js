function route(handle, pathname) {
  console.log('About to route a request for ' + pathname);
  if (typeof handle[pathname] == 'function') {
    handle[pathname]();
  } else {
    console.log('no request handler found for ' + pathname);
    return '404 not found'; // 当请求无法路由的时候，也向【前端/浏览器】返回一些相关的错误信息
  }
}
exports.route = route;
