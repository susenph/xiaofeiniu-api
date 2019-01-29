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
    //查询所有的菜品类别
    var sql = "SELECT cid,cname FROM xfn_category ORDER BY cid";
    
    pool.query(sql, (err, result) => {
        if(err) throw err;
        //菜品类别数组
        var categoryList = result;
        //已经查询完菜品的类别的数量
        var finishCount = 0;
        for(let c of categoryList){
            //循环查询每个类别下有哪些菜品
            var sql = "SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC";
            
            pool.query(sql, c.cid, (err, result) => {
                if(err) throw err;
                c.dishList = result;
                finishCount++;
                //必须保证所有的菜品类别下的菜品都查询完才能发送响应消息——这些查询都是异步执行的
                if(finishCount === categoryList.length){
                    res.send(categoryList);
                }
            });
        }
    });
});

/**
 * API: POST /admin/dish/image
 * 请求参数：
 * 含义：接收客户端上传的菜品图片，保存在服务器上，返回该图片在服务器上的随机文件名
 * 返回值形如：
 *  { code: 200, msg: 'upload succ', fileName: 'xxx' }
 */
//引入multer中间件
const multer = require('multer');
const fs = require('fs');
//指定客户端上传的文件临时存储路径
var upload = multer({ dest: 'tmp' });
//定义路由，使用文件上传中间件
router.post('/image', upload.single('dishImg'), (req, res) => {
    //客户端上传的图片文件
    //console.log(req.file);
    //客户端随同图片提交的字符数据
    //console.log(req.body);
    //把客户端上传的文件从临时目录转移到永久的图片路径下
    var tmpFile = req.file.path; //临时文件路径
    var suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.')); //原始文件名的后缀
    var newFile = randFileName(suffix); //目标文件名
    //把临时文件转移到目标文件
    fs.rename(tmpFile, 'img/dish/' + newFile, () => {
        res.send({ code: 200, msg: 'upload succc', fileName: newFile });
    });
});

/**
 * 生成一个随机文件名
 * @param {*} suffix 表示要生成文件名中的后缀 
 */
function randFileName(suffix) {
    var time = new Date().getTime();
    //4位的随机数
    var num = Math.floor(Math.random() * (10000 - 1000) + 1000);
    return time + '-' + num + suffix;
}

/**
 * API: POST /admin/dish
 * 请求参数：{ title: 'xxx', imgUrl: 'xxx', ... }
 * 含义：添加新的菜品
 * 返回值形如：
 *  { code: 200, msg: 'one category added', dishId: x }
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
        res.send({ code: 200, msg: 'one dish added', dishId: result.insertId });
    });
});

/**
 * API: DELETE /admin/dish/:did
 * 含义：根据表示菜品编号的路由参数，删除该菜品
 * 返回值形如：
 *  { code: 200, msg: 'one dish deleted' }
 *  { code: 400, msg: 'zero dish deleted' }
 */ 
router.delete('/:did', (req, res) => {
    //注意：删除菜品类别之前必须先把属于该类别的菜品的类别编号设置为NULL
    var did = req.params.did;
    if(!did){
        res.send({ code: 400, msg: 'not did' });
        return;
    }
    //修改菜品类别编号sql语句
    var sql1 = "UPDATE xfn_order_detail SET dishId=NULL WHERE dishId=?";
    //删除菜品类别sql语句
    var sql2 = "DELETE FROM xfn_shid WHERE did=?";
    cid = parseInt(cid);

    pool.query(sql1, cid, (err, result) => {
        if(err) throw err;
        //至此指定类别的菜品已经修改完毕,执行删除操作
        pool.query(sql2, cid, (err, result) => {
            if(err) throw err;
            if(result.affectedRows > 0){
                res.send({ code: 200, msg: 'one dish deleted' }); 
            }else{
                res.send({ code: 401, msg: 'zero dish deleted' });
            }   
        });
    });   
});

/**
 * API: PUT /admin/category
 * 请求参数：{ did: xx, title: 'xxx', ... }
 * 含义：根据菜品类别编号修改该类别
 * 返回值形如：
 *  { code: 200, msg: 'one dish modifyed' }
 *  { code: 400, msg: 'zero dish modifyed, not exists' }
 *  { code: 401, msg: 'zero dish modifyed, no modifycation' }
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