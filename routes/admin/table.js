const pool = require('../../pool');
const express = require('express');

var router = express.Router();

router.get('/list', function(req, res) {
    var sql = 'SELECT * FROM xfn_table';
    
    pool.query(sql, function(err, result) {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({ code: 200, data: result });
        }else{
            res.send({ code: 301, msg: 'SELECT TABLE ERROR' });
        }
    });
});

router.get('/add', function(req, res) {
    var tname = req.query.tname;
    var type = req.query.type;
    var status = req.query.status;
    
    if(!tname){
        res.send({ code: 401, msg: 'TNAME CAN NOT BE EMPTY' });
        return;
    }
    if(!type){
        res.send({ code: 402, msg: 'TYPE CAN NOT BE EMPTY' });
        return;
    }
    if(!status){
        res.send({ code: 403, msg: 'STATUS CAN NOT BE EMPTY' });
        return;
    }
    
    var sql = "INSERT INTO xfn_table('tid', 'tname', 'type', 'status') VALUES(NULL, ?, ?, ?)";

    pool.query(sql, [tname, type, status], function(err, result) {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({ code: 200, msg: 'SUCCESS' });
        }else{
            res.send({ code: 301, msg: 'INSERT ERROR' });
        }
    });
});

router('/delete', function(req, res) {
    var tid = req.query.tid;
    
    if(!tid){
        res.send({ code: 401, msg: 'TID CAN NOT BE EMPTY' });
        return;
    }
    
    var sql = 'DELETE FROM xfn_table WHERE tid=?';

    pool.query(sql, [tid], function(err, result) {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({ code: 200, msg: 'DELETE SUCCESS' });
        }else{
            res.send({ code: 301, msg: 'DELETE ERROR' });
        }
    });
});

module.exports = router;