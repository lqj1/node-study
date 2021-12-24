// 定义路由
var express = require('express');
var router = express.Router();
router.use(function timeLog(req, res, next) {
  console.log('Time ', Date.now());
  next();
});
// 主页路由
router.get('/', function (req, res) {
  res.send('Birds home page');
});
router.get('/about', function (req, res) {
  res.send('About birds');
});
module.exports = router;

// 加载
var birds = require('./birds');
// ...
app.use('/birds', birds);
