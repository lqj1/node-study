## 快速入门

> http://www.mongoosejs.net/docs/guide.html

```javascript
// 假设我们都很喜欢喵星人，想在MongoDB里记录每只我们见过的喵星人
// 引入mongoose并连接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
// connect返回pending的连接，接着加上成功提醒和失败警告
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  // connected,连接成功时，回调会被调用
});
// 下面的所有函数运行在这个回调函数中
// Mongoose中，一切始于Schema
var kittySchema = mongoose.Schema({
  name: String,
});
// 得到String类型name属性的schema,接着把这个schema编译成一个Model
var Kitten = mongoose.model('Kitten', kittySchema);
// model是我们构造document的Class，在这个例子中，每个document都是一只喵，它的属性和行为都会被声明在schema
// 它的属性和行为都会被声明在schema，现在我们来创造一只喵
var cat1 = new Kitten({ name: 'lqjCat1' });
console.log(cat1.name); // 'lqjCat1'
// 声明方法
kittySchema.methods.speak = function () {
  var greeting = this.name ? 'Meow name is ' + this.name : "I don't have a name";
  console.log(greeting);
};
var Kitten = mongoose.model('Kitten', kittySchema);
// KittySchema 是 schema，通过mongoose.model编译后变成了 Model，也就是Kitten
// 加在schema methods属性的函数会编译到 Model 的prototype，也会暴露到每个document实例
var cat2 = new Kitten({ name: 'lqjCat2' });
cat2.speak();
// 每个document会在调用它的save方法后保存到数据库，回调的第一个参数永远是error
cat2.save(function (err, cat2) {
  if (err) {
    return console.error(err);
  }
  cat2.speak();
});
// 到此，收集了很多喵，可以通过一下方法获取喵星人model里的所有数据,Kitten是一个Model
Kitten.find(function (err, kittens) {
  if (err) {
    return console.error(err);
  }
  console.log(kittens);
});
// 如果想获取特定的数据，可了解一下query
Kitten.find({ name: /^cat1/ }, callback); // 这样可以获得所有name为cat1开头的数据
```
