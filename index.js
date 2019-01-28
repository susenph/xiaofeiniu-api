/**
 * 小肥牛扫码点餐系统API子系统
 */
const PORT = 8090;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRouter = require('./routes/admin/admin');
const settingsRouter = require('./routes/admin/settings');
const categoryRouter = require('./routes/admin/category');
const dishRouter = require('./routes/admin/dish');
const tableRouter = require('./routes/admin/table');

//创建HTTP应用服务器
var app = express();

app.listen(PORT, () => {
    console.log(`Server Listening ${ PORT } ...`);
});
//使用cors中间件
app.use(cors());
//app.use(bodyParser.urlencoded({}))把application/x-www-form-urlencoded格式的请求主体数据解析出来放入req.body属性
//使用body-parser中间件--把JSON格式的请求主体数据解析出来放入req.body属性
app.use(bodyParser.json());
//把路由器挂载到/admin下
app.use('/admin', adminRouter);
//把路由器挂载到/settings下
app.use('/admin/settings', settingsRouter);
//把路由器挂载到/admin/category下
app.use('/admin/category', categoryRouter);
//把路由器挂载到/dish下
app.use('/admin/dish', dishRouter);
//把路由器挂载到/table下
app.use('/admin/table', tableRouter);
