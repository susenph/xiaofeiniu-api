/**
 * 小肥牛扫码点餐系统API子系统
 */
const PORT = 8090;
const express = require('express');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin/admin');
const settingsRouter = require('./routes/admin/settings');
const categoryRouter = require('./routes/admin/category');
const dishRouter = require('./routes/admin/dish');
const tableRouter = require('./routes/admin/table');

//启动主服务器
var app = express();

app.listen(PORT, () => {
    console.log(`Server Listening ${ PORT } ...`);
});
//使用body-parser中间件
app.use(bodyParser.urlencoded({
    extended: false
}));
//把路由器挂载到/admin下
//app.use('/admin', adminRouter);
//把路由器挂载到/settings下
app.use('/settings', settingsRouter);
//把路由器挂载到/category下
//app.use('/category', categoryRouter);
//把路由器挂载到/dish下
//app.use('/dish', dishRouter);
//把路由器挂载到/table下
app.use('/table', tableRouter);
