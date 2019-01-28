/**
 * 管理员相关的路由
 */
const pool = require('../../pool');
const express = require('express');

var router = express.Router();

/**
 * API: GET /admin/login/:aname/:apwd
 * 完成用户登录验证(提示：有的项目中此处选择POST请求)
 * 返回数据：
 *  { code: 200, msg: 'login succ' }
 *  { code: 400, msg: 'aname or apwd empty' }
 */
router.get('/login/:aname/:apwd', (req, res) => {
    var aname = req.params.aname;
    var apwd = req.params.apwd;
    if(!aname){
        res.send({ code: 400, msg: aname + ' not empty' });
        return;
    }
    if(!apwd){
        res.send({ code: 401, msg: apwd + ' not empty'});
        return;
    }
    //需要对用户输入的密码执行加密函数
    var sql = "SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)";

    pool.query(sql, [aname, apwd], (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            res.send({ code: 200, msg: 'login succ' });
        }else{
            res.send({ code: 402, msg: 'aname or apwd empty' });
        }
    });
});

/**
 * API: PATCH /admin
 * 请求数据：{ aname: 'xxx', oldPwd: 'xxx', newPwd: 'xxx' }
 * 根据管理员名和密码修改密码
 * 返回数据：
 *  { code: 200, msg: 'modified succ' }
 *  { code: 400, msg: 'password err' }
 */
router.patch('/', (req, res) => {
    var data = req.body;
    if(!data){
        res.send({ code: 400, msg: 'data not empty' });
        return;
    }
    //首先根据aname/oldPwd查询该用户是否存在
    //如果查询到了用户，再修改其密码
    var sql1 = "SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)";
    var sql2 = "UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=? AND apwd=PASSWORD(?)";

    pool.query(sql1, [data.aname, data.oldPwd], (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            pool.query(sql2, [data.newPwd, data.aname, data.oldPwd], (err, result) => {
                if(err) throw err;
                res.send({ code: 200, msg: 'modified succ' });
            });
        }else{
            res.send({ code: 401, msg: 'password err' });
        }
    });
});

module.exports = router;