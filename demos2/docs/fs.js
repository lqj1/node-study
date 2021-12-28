// 1. fs 文件系统
// fs 模块支持以标准 POSIX 函数建模的方式与文件系统进行交互。
// 要使用基于 promise 的 API：
import * as fs from 'fs/promises';
// 要使用回调和同步的API
import * as fs from 'fs';
// Promise的示例
import { unlink } from 'fs';
try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error: ', error.message);
}
// 回调的示例
unlink('/tmp/hello', err => {
  if (err) {
    throw err;
  }
  console.log('successful deleted /tmp/hello');
});
// 当达到最佳性能时（无论是在执行时间还是在内存分配方面），fs 模块基于回调的 API 版本都比使用 promise API 更好
// 同步的示例
// 同步的 API 会阻止 Node.js 事件循环和进一步的 JavaScript 执行，直到操作完成。
// 2. Promise的API
// fs/promises API 提供了返回 promise 的异步的文件系统方法。
// Promise API 使用底层的 Node.js 线程池在事件循环线程之外执行文件系统操作。
// 这些操作不是同步的也不是线程安全的。 对同一文件执行多个并发修改时必须小心，否则可能会损坏数据。
// 2.1 FileHandle类
