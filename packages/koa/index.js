const Koa = require('koa');
const app = new Koa();
app.use(async ctx => {
  ctx.body = 'Hello World';
});
app.listen(3000);
// 级联
const Koa = require('koa');
const app = new Koa();
// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} ${rt}`);
});
// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next();
})
