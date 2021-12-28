// 1.buffer 缓冲区
// Buffer对象用于表示固定长度的字节序列
import { Buffer } from 'buffer';
import { blob } from 'stream/consumers';
// 创建长度为10的以零为填充的缓冲区
const buf1 = Buffer.alloc(10);
// 创建长度为10的以1填充的缓冲区
const buf2 = Buffer.alloc(10, 1);
// 创建长度为10的未初始化的缓冲区，比调用Buffer.alloc()快
// 但返回的缓冲区实例可能包含旧数据，需要使用fill()、write()，或其他填充缓冲区内容的函数重写
const buf3 = Buffer.allocUnsafe(10);
// 创建包含字节[1,2,3]的缓冲区
const buf4 = Buffer.from([1, 2, 3]);
// 创建包含字节[1,1,1,1]的缓冲区，所有条目都使用`(value & 255)`截断以符合范围 0-255
const buf5 = Buffer.from([257, 257.5, -255, '1']);
// 2. 缓冲区与字符编码
// 当在 Buffer 和字符串之间进行转换时，可以指定字符编码。如果未指定字符编码，则默认使用 UTF-8。
const buf = Buffer.from('hello world', 'utf8');
console.log(buf.toString('hex'));
console.log(buf.toString('base64'));
// Nodejs支持Buffer转字符串：utf8,utf16le,latin1
// 将Buffer转换为字符串成为解码，将字符串转换为Buffer成为编码
// Nodejs支持以下二进制转文本编码：base64,base64url,hex,此时Buffer转字符串称为编码、字符串转Buffer成为解码（过程相反）
// 3. 缓冲区与TypedArray
// Buffer实例也是JavaScript Uint8Array和TypedArray实例
// 两种方法从Buffer创建新的TypedArray实例
// 3.1 将Buffer传给TypedArray构造函数将复制Buffer的内容，解释为整数数组，而不是目标类型的字节序列
const buf = Buffer.from([1, 2, 3, 4]);
const unit32array = new Unit32Array(buf);
// 通过以相同方式使用TypedArray对象的.buffer属性，可以创建新的Buffer，它与TypedArray实例共享相同的分配内存
// Buffer.from()在这种情况下表现得像new Uint8Array
const arr = new Uint16Array(2);
arr[0] = 5000;
arr[1] = 4000;
// 复制`arr`的内容
const buf1 = Buffer.from(arr);
// 与`arr`共享内存
const buf2 = Buffer.from(arr.buffer);
console.log(buf1);
// 打印: <Buffer 88 a0>
console.log(buf2);
// 打印: <Buffer 88 13 a0 0f>
arr[1] = 6000;
console.log(buf1);
// 打印: <Buffer 88 a0>,复制的buffer不会被修改内容，深复制
console.log(buf2);
// 打印: <Buffer 88 13 70 17>，而共享内存会被修改内容，浅复制
// 使用TypedArray的.buffer创建Buffer时，可以通过传入byteOffset和length参数仅使用底层ArrayBuffer的一部分
const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);
console.log(buf.length); // 16
// Buffer.from()和TypedArray.from()具有不同签名和实现。
// TypedArray 变体接受第二个参数，该参数是在类型化数组的每个元素上调用的映射函数。
// 但是，Buffer.from() 方法不支持使用映射函数。
// 4. 缓冲区与迭代器
// 可以使用 for..of迭代Buffer实例
const buf = Buffer.from([1, 2, 3]);
for (const b of buf) {
  console.log(b);
}
// buf.values()、buf.keys()、buf.entries()方法可用于创建迭代器
// 5. Blob类
// 封装了不可变的原始数据，可以在多个工作线程之间安全地共享。new buffer.Blob([sources[,options]])
blob.arrayBuffer();
blob.size;
blob.slice;
blob.stream();
blob.text();
blob.type;
// Blob对象和MessageChannel
// 一旦创建了<Blob>对象，就可以通过MessagePort将其发送到多个目的地，而无需传输或立即复制数据
// 只有在调用arrayBuffer()或text()方法时才会复制Blob包含的数据
import { setTimeout as delay } from 'timers/promises';
const blob = new Blob(['hello there']);
const mc1 = new MessageChannel();
const mc2 = new MessageChannel();
mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};
mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close;
};
mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);
// 发布后Blob仍然可用
blob.text().then(console.log);
// Buffer类
// Buffer类是直接处理二进制数据的全局类型，它可以使用多种方式构建
Buffer.alloc();
// 如果 size 大于 buffer.constants.MAX_LENGTH 或小于 0，则抛出 ERR_INVALID_ARG_VALUE。
// 如果指定了 fill，则分配的 Buffer 将通过调用 buf.fill(fill) 进行初始化。
const buf = Buffer.alloc(5, 'a');
console.log(buf);
// 打印：<Buffer 61 61 61 61 61> 二进制
Buffer.allocUnsafe(size);
// 以这种方式创建的 Buffer 实例的底层内存不会被初始化。 新创建的 Buffer 的内容是未知的，可能包含敏感的数据。
const buf = Buffer.allocUnsafe(10);
console.log(buf); // 打印（内容可能会有所不同）: <Buffer a0 8b 28 3f 01 00 00 00 50 32>
buf.fill(0);
console.log(buf);
// 打印: <Buffer 00 00 00 00 00 00 00 00 00 00>
Buffer.allocUnsafeSlow(size);
