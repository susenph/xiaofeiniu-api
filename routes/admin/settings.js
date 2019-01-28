/**
 * 全局设置相关的路由
 */
const pool = require('../../pool');
const express = require('express');

var router = express.Router();

/**
 * API: GET /admin/settings
 * 查询全局设置
 * 返回数据
 *  { sid: 1, ... }
 */
router.get('/', (req, res) => {
    var sql = "SELECT * FROM xfn_settings";

    pool.query(sql, (err, result) => {
        if(err) throw err;
        if(result.length > 0){
            res.send(result);
        }else{
            res.send({ code: 400, msg: 'global settings is empty' });
        }
    });
});

/**
 * API: PUT /admin/settings
 * 修改全局设置
 * 返回数据：
 *  { code: 200, msg: 'modified succ' }
 */
router.put('/', (req, res) => {
    var data =req.body;
    if(!data){
        res.send({ code: 400, msg: 'data not empty' });
        return;
    }
    //需要对用户输入的密码执行加密函数
    var sql = "UPDATE xfn_settings SET ?";

    pool.query(sql, data, (err, result) => {
        if(err) throw err;
        if(result.changedRows > 0){
            res.send({ code: 200, msg: 'modified succ' });
        }else{
            res.send({ code: 402, msg: 'modified err, no dodifycation' });
        }
    });
});

module.exports = router;