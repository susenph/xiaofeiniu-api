/**
 * 菜品相关的路由
 */
const express = require('express');
const pool = require('../../pool');

var router = express.Router();

/**
 * API: GET /admin/dish   
 * 含义：获取所有的菜品（按类别进行分类）
 * 返回值形如：
 *  [{ cid: 1, cname: '...', dishList: [{}, {}, {}, ...] }, { ... }]
 */ 
router.get('/', (req, res) => {
    //查询所有的菜品
    var sql = "SELECT cid,cname FROM xfn_category";
    
    pool.query(sql, (err, result) => {
        if(err) throw err;
        //菜品类别数组
        var categoryList = result;
        var count = 0;
        for(var i = 0; i < categoryList.length; i++){
            //循环查询每个类别下有哪些菜品
            var sql = "SELECT * FROM xfn_dish WHERE categoryId=?";
            
            pool.query(sql, categoryList[i].cid, (err, result) => {
                if(err) throw err;
                console.log(categoryList[i]);
                //categoryList[i].dishList = result;
                count++;
                if(count === categoryList.length){
                    
                }
            });
        }
    });
});

/**
 * API: POST /admin/dish
 * 请求参数：{ title: 'xxx', imgUrl: 'xxx', ... }
 * 含义：添加新的菜品
 * 返回值形如：
 *  { code: 200, msg: 'one category added', cid: x }
 */ 
router.post('/', (req, res) => {
    var data = req.body; 
    if(!data){
        res.send({ code: 400, msg: 'data not empty' });
        return;
    }
    //注意sql语句的简写
    var sql = 'INSERT INTO xfn_dish SET ?';

    pool.query(sql, data, (err, result) => {
        if(err) throw err;
        res.send({ code: 200, msg: 'one category added', cid: result.insertId });
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