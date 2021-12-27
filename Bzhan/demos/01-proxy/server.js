const http = require('http');
const url = require('url');
const { createProxyMiddleware } = require('http-proxy-middleware');
const server = http.createServer((req, res) => {
  const urlStr = req.url;
  console.log(urlStr);
  if (/\/api/.test(urlStr)) {
    const proxy = createProxyMiddleware('/api', {
      target: 'https://www.baidu.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // 转发的时候把api去掉
      },
    });
    proxy(req, res);
  } else {
    console.log('error');
  }
});
server.listen(8080, () => {
  console.log('localhost:8080');
});
