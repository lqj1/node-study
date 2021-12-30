var server = require('./server'); // 服务端的主要处理程序
var router = require('./router'); // 路由返回处理函数或者提示信息
var requestHandlers = require('./requestHandlers'); // 根据不同url对应不同程序处理

var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;

server.start(router.route, handle); // 连接路由和处理程序
