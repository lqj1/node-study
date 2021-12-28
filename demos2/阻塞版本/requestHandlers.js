// 将请求处理程序和路由模块连接起来，让路由"有路可寻"
function start() {
  console.log('request handler start was called');
  function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  }
  sleep(10000); // 先打开start，再打开upload两个页面,start会等待10s执行，而upload也需要等待，也就是进行了阻塞
  return 'Hello Start';
}
function upload() {
  console.log('request handler upload was called');
}
exports.start = start;
exports.upload = upload;

/** 
原因就是start()包含了阻塞操作。形象的说就是“它阻塞了所有其他的处理工作”。

这显然是个问题，因为Node一向是这样来标榜自己的：“在node中除了代码，所有一切都是并行执行的”。

这句话的意思是说，Node.js可以在不新增额外线程的情况下，依然可以对任务进行并行处理 —— Node.js是单线程的。它通过事件轮询（event loop）来实现并行操作，对此，我们应该要充分利用这一点 —— 尽可能的避免阻塞操作，取而代之，多使用非阻塞操作。

然而，要用非阻塞操作，我们需要使用回调，通过将函数作为参数传递给其他需要花时间做处理的函数（比方说，休眠10秒，或者查询数据库，又或者是进行大量的计算）。

对于Node.js来说，它是这样处理的：“嘿，probablyExpensiveFunction()（译者注：这 里指的就是需要花时间处理的函数），你继续处理你的事情，我（Node.js线程）先不等你了，我继续去处理你后面的代码，请你提供一个 callbackFunction()，等你处理完之后我会去调用该回调函数的，谢谢！”
*/
