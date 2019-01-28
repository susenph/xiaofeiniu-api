/**
 * 菜品类别相关的路由
 */
//创建路由器
const express = require('express');
const pool = require('../../pool');

var router = express.Router();

/**
 * RESTful风格的API
 * API: GET /admin/category    
 * 含义：客户端获取所有的菜品类别，按编号升序排列
 * 返回值形如：
 *  [{ cid: 1, cname: '...' }, { ... }]
 */ 
router.get('/', (req, res) => {
    var sql = "SELECT * FROM xfn_category ORDER BY cid";
    
    pool.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

/**
 * API: DELETE /admin/category/:cid
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值形如：
 *  { code: 200, msg: 'one category deleted' }
 *  { code: 400, msg: 'zero category deleted' }
 */ 
router.delete('/:cid', (req, res) => {
    //注意：删除菜品类别之前必须先把属于该类别的菜品的类别编号设置为NULL
    var cid = req.params.cid;
    if(!cid){
        res.send({ code: 400, msg: 'not cid' });
        return;
    }
    //修改菜品类别编号sql语句
    var sql1 = "UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?";
    //删除菜品类别sql语句
    var sql2 = "DELETE FROM xfn_category WHERE cid=?";
    cid = parseInt(cid);

    pool.query(sql1, cid, (err, result) => {
        if(err) throw err;
        //至此指定类别的菜品已经修改完毕,执行删除操作
        pool.query(sql2, cid, (err, result) => {
            if(err) throw err;
            if(result.affectedRows > 0){
                res.send({ code: 200, msg: 'one category deleted' }); 
            }else{
                res.send({ code: 401, msg: 'zero category deleted' });
            }   
        });
    });   
});

/**
 * API: POST /admin/category
 * 请求参数：{ cname: 'xxx' }
 * 含义：添加新的菜品类别
 * 返回值形如：
 *  { code: 200, msg: 'one category added', cid: x }
 */ 
router.post('/', (req, res) => {
    //形如{ cname: 'xxx' }
    var data = req.body; 
    if(!data){
        res.send({ code: 400, msg: 'data not empty' });
        return;
    }
    //注意sql语句的简写
    var sql = 'INSERT INTO xfn_category SET ?';

    pool.query(sql, data, (err, result) => {
        if(err) throw err;
        res.send({ code: 200, msg: 'one category added', cid: result.insertId });
    });
});

/**
 * API: PUT /admin/category
 * 请求参数：{ cid: xx, cname: 'xxx' }
 * 含义：根据菜品类别编号修改该类别
 * 返回值形如：
 *  { code: 200, msg: 'one category modifyed' }
 *  { code: 400, msg: 'zero category modifyed, not exists' }
 *  { code: 401, msg: 'zero category modifyed, no modifycation' }
 */
router.put('/', (req, res) => {
    //请求数据{ cid: xx, cname: 'xxx' }
    var data = req.body;
    if(!data){
        res.send({ code: 400, msg: 'data not empty' });
        return;
    }
    //TODO: 此处可以对数据进行验证
    var sql = "UPDATE xfn_category SET ? WHERE cid=?";

    pool.query(sql, [data, data.cid], (err, result) => {
        if(err) throw err;
        if(result.changedRows > 0){
            res.send({ code: 200, msg: 'one category modifyed' });
        }else if(result.affectedRows === 0){
            res.send({ code: 401, msg: 'zero category modifyed, not exists' });
        }else if(result.affectedRows === 1 && result.changedRows === 0){
            res.send({ code: 402, msg: 'zero category modifyed, no modifycation' });
        }
    });
});

module.exports = router;